import { useState, useEffect } from 'react';
import { fetchMemberProfile } from '@/api/mypage/memberService';

interface ProfileInit {
  nickname: string;
  blogUrl: string;
  githubUrl: string;
  profileUrl: string;
}

export function useProfileData(
  isMyPage: boolean,
  myId: number | undefined,
  isCompany: boolean
) {
  const [modalInit, setModalInit] = useState<ProfileInit>({
    nickname: '',
    blogUrl: '',
    githubUrl: '',
    profileUrl: '',
  });

  // 내 페이지면 현재 프로필 불러와서 모달 기본값으로 세팅
  useEffect(() => {
    let ignore = false; 
    async function loadMine() {
      if (!isMyPage || !myId || myId <= 0 || isCompany) return;
      try {
        const me = await fetchMemberProfile(myId);
        if (!ignore) {
          setModalInit({
            nickname: me?.nickname ?? '',
            blogUrl: me?.blogUrl ?? '',
            githubUrl: me?.githubUrl ?? '',
            profileUrl: me?.memberProfileUrl ?? '',
          });
        }
      } catch (e) {
        console.error('내 프로필 조회 실패:', e);
      }
    }
    loadMine();
    return () => {
      ignore = true;
    };
  }, [isMyPage, myId, isCompany]);

  return {
    modalInit,
    setModalInit,
  };
}
