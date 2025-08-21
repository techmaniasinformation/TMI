import { useState } from 'react';
import { updateMemberProfile, fetchMemberProfile } from '@/api/mypage/memberService';
import { useUserStore } from '@/stores/userStore';

interface ProfileInit {
  nickname: string;
  blogUrl: string;
  githubUrl: string;
  profileUrl: string;
}

export function useProfileSave(
  isMyPage: boolean,
  myId: number | undefined,
  modalInit: ProfileInit,
  nicknameDaysLeft: number,
  recordNicknameChange: (nickname: string) => void,
  setModalInit: (data: ProfileInit) => void,
  setRefreshKey: (updater: (k: number) => number) => void
) {
  const { updateUserProfile } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);

  // 프로필 저장
  const handleProfileSave = async (
    newNickname: string,
    newBlogUrl: string,
    newGithubUrl?: string,
    newProfileUrl?: string | null,
    file?: File | null
  ) => {
    if (!isMyPage || !myId || myId <= 0) {
      alert('내 프로필에서만 수정할 수 있습니다.');
      return false;
    }

    // 닉네임 쿨타임 프리체크
    const nicknameChanged = (newNickname ?? '').trim() !== (modalInit.nickname ?? '').trim();
    if (nicknameChanged && nicknameDaysLeft > 0) {
      alert(`닉네임은 ${nicknameDaysLeft}일 후에 변경할 수 있어요.`);
      return false;
    }

    setIsSaving(true);
    try {
      // 조건부 페이로드 구성: 바꾸는 것만 보낸다
      const payload: any = {
        nickname: newNickname,
        blogUrl: newBlogUrl || null,
        githubUrl: (newGithubUrl ?? '') || null,
      };

      if (file instanceof File) {
        // 파일 있을 때: 파일만 보내고 URL은 포함하지 않음(서버가 새 파일 기준으로 세팅)
        payload.file = file;
      } else {
        // 파일 없고, URL을 실제로 바꾸려는 경우에만 포함 (안 바꾸면 키 생략)
        const willChangeUrl =
          typeof newProfileUrl !== 'undefined' &&
          newProfileUrl !== (modalInit.profileUrl || '');
        if (willChangeUrl) {
          payload.memberProfileUrl = newProfileUrl || null; // 빈 문자열이면 null
        }
      }

      // PATCH
      await updateMemberProfile(myId, payload);

      // 닉네임 쿨타임 기록
      if (nicknameChanged) {
        recordNicknameChange(newNickname);
      }

      // 최신 데이터 재조회 → 전역 헤더 즉시 반영
      const updated = await fetchMemberProfile(myId);
      updateUserProfile({
        nickname: updated?.nickname,
        memberProfileUrl: updated?.memberProfileUrl,
      });

      // 모달 초기값도 동기화 (페이지 내 표시 일관성)
      setModalInit({
        nickname: updated?.nickname ?? '',
        blogUrl: updated?.blogUrl ?? '',
        githubUrl: updated?.githubUrl ?? '',
        profileUrl: updated?.memberProfileUrl ?? '',
      });

      // 헤더 즉시 리프레시 (ProfileHeader useEffect가 refreshKey를 의존성으로 가지는 전제)
      setRefreshKey((k) => k + 1);

      // 성공 메시지
      alert('프로필이 성공적으로 수정되었습니다.');
      
      return true; // 성공
    } catch (e: any) {
      console.error('프로필 저장 실패:', e);
      alert(e?.message || '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      return false; // 실패
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleProfileSave,
    isSaving,
  };
}
