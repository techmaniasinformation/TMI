// 프로필 조회/수정 API
import { fetchMemberProfile, updateMemberProfile } from '@/api/mypage/memberSevice';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import ProfileHeader from '@/components/layout/mypage/ProfileHeader';
import MyPageTabs from '@/components/layout/mypage/MypageTabs';
import ProfileEditModal from '@/components/layout/mypage/ProfileEditModal';

import { getCompany } from '@/api/company/company';
import type { Company } from '@/types/company/company';

import type { MyTab } from '@/components/layout/mypage/MypageTabs';

// [ADD] 닉네임 쿨타임 유틸 (localStorage)
const NICK_COOLDOWN_KEY = (memberId: number) => `nicknameCooldown:${memberId}`;

function getDaysLeft(ts?: number): number {
  if (!ts) return 0;
  const unlock = ts + 7 * 24 * 60 * 60 * 1000;
  const diff = unlock - Date.now();
  return diff > 0 ? Math.ceil(diff / (24 * 60 * 60 * 1000)) : 0;
}

// 팔로우 API
import {
  createMemberFollow,
  deleteMemberFollow,
  createCompanyFollow,
  deleteCompanyFollow,
  findMemberFollowId,
  findCompanyFollowId,
} from '@/api/followService';

// ✅ store
import { useUserStore } from '@/stores/userStore';

interface MyPageProps {
  isCompany: boolean;
}

interface UserStats {
  posts: number;
  comments: number;
  followers: number;
  likes: number;
  views: number;
  bugReports: number;
  tagCounts: { SPRING: number; REACT: number; AI: number; DB: number; AWS: number };
  hasFirstPost: boolean;
  hasFirstComment: boolean;
  isRegistered: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ isCompany }) => {
  // 프로필 수정 모달 초기값
  const [modalInit, setModalInit] = useState({
    nickname: '',
    blogUrl: '',
    githubUrl: '',
    profileUrl: '',
  });

  const { id } = useParams();
  const routeId = Number(id) || 0; // ✅ 숫자 가드

  // store에서 내 id/업데이트 액션 읽기
  const { user, updateUserProfile } = useUserStore();
  const myId = user?.memberId;

  // 내 페이지 여부 계산
  const isMyPage = !!(myId && myId > 0 && myId === routeId);

  // [ADD] ProfileHeader를 재조회하기 위한 키
  const [refreshKey, setRefreshKey] = useState(0);

  // 초기 탭
  const [activeTab, setActiveTab] = useState<MyTab>('profile');
  useEffect(() => {
    setActiveTab(isMyPage ? 'profile' : (isCompany ? 'posts' : 'profile'));
  }, [isMyPage, isCompany]);

  // [ADD] 내 페이지면 현재 프로필 불러와서 모달 기본값으로 세팅
  useEffect(() => {
    let ignore = false;
    async function loadMine() {
      if (!isMyPage || !myId || myId <= 0 || isCompany) return;
      try {
        const me = await fetchMemberProfile(myId);
        if (!ignore) {
          setModalInit({
            nickname: me.nickname ?? '',
            blogUrl: me.blogUrl ?? '',
            githubUrl: me.githubUrl ?? '',
            profileUrl: me.memberProfileUrl ?? '',
          });

          // [ADD] localStorage에서 최근 닉네임 변경 시각 읽어서 남은 일수 계산
          try {
            const raw = localStorage.getItem(NICK_COOLDOWN_KEY(myId));
            if (raw) {
              const saved = JSON.parse(raw) as { lastChangedAt: number; nickname: string };
              // 서버 닉네임과 저장된 닉네임이 다르면(다른 브라우저/기기에서 변경됨) 지금부터 7일로 리셋
              if ((saved.nickname ?? '') !== (me.nickname ?? '')) {
                localStorage.setItem(
                  NICK_COOLDOWN_KEY(myId),
                  JSON.stringify({ lastChangedAt: Date.now(), nickname: me.nickname ?? '' })
                );
                setNicknameDaysLeft(7);
              } else {
                setNicknameDaysLeft(getDaysLeft(saved.lastChangedAt));
              }
            } else {
              setNicknameDaysLeft(0);
            }
          } catch {
            setNicknameDaysLeft(0);
          }
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

  // [ADD] 닉네임 쿨타임 남은 일수
  const [nicknameDaysLeft, setNicknameDaysLeft] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 대표 배지 (상단 표시)
  const [repBadge, setRepBadge] = useState<{ id: number | null; url: string | null }>({
    id: null,
    url: null,
  });
  const handleRepChange = useCallback((p: { badgeId: number | null; badgeUrl: string | null }) => {
    setRepBadge((prev) =>
      prev.id === p.badgeId && prev.url === p.badgeUrl ? prev : { id: p.badgeId, url: p.badgeUrl }
    );
  }, []);

  // 실제 저장 호출로 변경
  const handleProfileSave = async (
    newNickname: string,
    newBlogUrl: string,
    newGithubUrl?: string,
    newProfileUrl?: string | null,
    file?: File | null
  ) => {
    if (!isMyPage || !myId || myId <= 0) {
      alert('내 프로필에서만 수정할 수 있습니다.');
      return;
    }

    // 닉네임 쿨타임 프리체크
    const nicknameChanged = (newNickname ?? '').trim() !== (modalInit.nickname ?? '').trim();
    if (nicknameChanged && nicknameDaysLeft > 0) {
      alert(`닉네임은 ${nicknameDaysLeft}일 후에 변경할 수 있어요.`);
      return;
    }

    try {
      // ✅ 조건부 페이로드 구성: 바꾸는 것만 보낸다
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
        localStorage.setItem(
          NICK_COOLDOWN_KEY(myId),
          JSON.stringify({ lastChangedAt: Date.now(), nickname: newNickname })
        );
      }

      // ✅ 최신 데이터 재조회 → 전역 헤더 즉시 반영
      const updated = await fetchMemberProfile(myId);
      updateUserProfile({
        nickname: updated.nickname,
        memberProfileUrl: updated.memberProfileUrl,
      });

      // 모달 초기값도 동기화 (페이지 내 표시 일관성)
      setModalInit({
        nickname: updated.nickname ?? '',
        blogUrl: updated.blogUrl ?? '',
        githubUrl: updated.githubUrl ?? '',
        profileUrl: updated.memberProfileUrl ?? '',
      });

      // [ADD] 헤더 즉시 리프레시 (ProfileHeader useEffect가 refreshKey를 의존성으로 가지는 전제)
      setRefreshKey((k) => k + 1);

      // (선택) 모달 닫기
      setIsEditModalOpen(false);
    } catch (e: any) {
      console.error('프로필 저장 실패:', e);
      alert(e?.message || '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const [userStats] = useState<UserStats>({
    posts: 15,
    comments: 42,
    followers: 128,
    likes: 256,
    views: 3200,
    bugReports: 5,
    tagCounts: { SPRING: 12, REACT: 8, AI: 4, DB: 15, AWS: 11 },
    hasFirstPost: true,
    hasFirstComment: true,
    isRegistered: true,
  });

  /** ========== 팔로우 상태 관리 ========== **/
  const currentUserId = myId; // 로그인 안 되어 있으면 <= 0

  const targetMemberId = !isCompany ? routeId : null;
  const targetCompanyId = isCompany ? routeId : null;

  const [isFollowing, setIsFollowing] = useState(false);
  const [memberFollowId, setMemberFollowId] = useState<number | null>(null);
  const [companyFollowId, setCompanyFollowId] = useState<number | null>(null);

  // 초기 팔로우 여부 확인
  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        if (isMyPage) return;
        if (!currentUserId) return;

        if (!isCompany && targetMemberId) {
          const id = await findMemberFollowId(currentUserId, targetMemberId);
          if (!ignore) {
            setMemberFollowId(id);
            setIsFollowing(!!id);
          }
        } else if (isCompany && targetCompanyId) {
          const id = await findCompanyFollowId(currentUserId, targetCompanyId);
          if (!ignore) {
            setCompanyFollowId(id);
            setIsFollowing(!!id);
          }
        }
      } catch (e) {
        console.error('팔로우 상태 조회 실패:', e);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [isCompany, isMyPage, targetMemberId, targetCompanyId, currentUserId]);

  // 팔/언팔 토글
  const handleFollowToggle = useCallback(async () => {
    if (isMyPage) return;
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (!isFollowing) {
        // 팔로우
        setIsFollowing(true); // 낙관적
        if (!isCompany && targetMemberId) {
          const res = await createMemberFollow(currentUserId, targetMemberId);
          setMemberFollowId(res.data.memberFollowId!);
        } else if (isCompany && targetCompanyId) {
          const res = await createCompanyFollow(currentUserId, targetCompanyId);
          setCompanyFollowId(res.data.companyFollowId!);
        }
      } else {
        // 언팔
        setIsFollowing(false); // 낙관적
        if (!isCompany) {
          const idToDelete =
            memberFollowId ??
            (targetMemberId ? await findMemberFollowId(currentUserId, targetMemberId) : null);
          if (idToDelete) await deleteMemberFollow(idToDelete);
          setMemberFollowId(null);
        } else {
          const idToDelete =
            companyFollowId ??
            (targetCompanyId ? await findCompanyFollowId(currentUserId, targetCompanyId) : null);
          if (idToDelete) await deleteCompanyFollow(idToDelete);
          setCompanyFollowId(null);
        }
      }
    } catch (e: any) {
      console.error('팔로우/언팔 실패:', e);
      setIsFollowing((prev) => !prev); // 롤백
      alert(e?.message || '팔로우 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [
    isCompany,
    isMyPage,
    isFollowing,
    memberFollowId,
    companyFollowId,
    targetMemberId,
    targetCompanyId,
    currentUserId,
  ]);

  /** ========== 기업 데이터 (기업 상단 카드) ========== **/
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCompany || routeId <= 0) return; // ✅ 불필요 호출 방지
    setLoading(true);
    getCompany(routeId)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isCompany, routeId]);

  const lastUpdateText =
    isCompany && company?.lastUpdatedAt ? company.lastUpdatedAt.slice(0, 10) : ''; // ✅ 포맷

  return (
    <div className="max-w-[1232px] mx-auto px-4 py-8">
      <div className="max-w-[1232px] mx-auto">
        <ProfileHeader
          isCompany={isCompany}
          isMyPage={isMyPage}
          lastUpdate={isCompany ? lastUpdateText : '2025-07-30'}
          onFollowToggle={handleFollowToggle}
          isFollowing={isFollowing}
          onEditClick={() => setIsEditModalOpen(true)}
          repBadgeUrl={repBadge.url}
          refreshKey={refreshKey} // ✅ 추가된 키 전달
        />

        <MyPageTabs
          isCompany={isCompany}
          isMyPage={isMyPage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userStats={userStats}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onRepresentativeBadgeChange={handleRepChange}
        />

        {isMyPage && (
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialNickname={modalInit.nickname}
            initialBlogUrl={modalInit.blogUrl}
            initialGithubUrl={modalInit.githubUrl}
            initialProfileImageUrl={modalInit.profileUrl}
            nicknameDisabled={nicknameDaysLeft > 0}
            nicknameHelperText={
              nicknameDaysLeft > 0 ? `닉네임은 ${nicknameDaysLeft}일 후 변경 가능` : undefined
            }
            onSave={handleProfileSave}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
