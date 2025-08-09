// /src/pages/MyPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ProfileHeader from '@/components/layout/mypage/ProfileHeader';
import MyPageTabs from '@/components/layout/mypage/MypageTabs';
import ProfileEditModal from '@/components/layout/mypage/ProfileEditModal';

import { getCompany } from '@/api/company/company';
import type { Company } from '@/types/company/company';

// 팔로우 API
import {
  createMemberFollow,
  deleteMemberFollow,
  createCompanyFollow,
  deleteCompanyFollow,
  findMemberFollowId,
  findCompanyFollowId,
} from '@/api/followService';

import { useParams } from 'react-router-dom';

interface MyPageProps {
  isCompany: boolean;
  isMyPage: boolean;
}

interface UserStats {
  posts: number;
  comments: number;
  followers: number;
  likes: number;
  views: number;
  bugReports: number;
  tagCounts: { SPRING: number; REACT: number; AI: number; DB: number; AWS: number; };
  hasFirstPost: boolean;
  hasFirstComment: boolean;
  isRegistered: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ isCompany, isMyPage }) => {
  const { id } = useParams();
  const routeId = Number(id);

  // 초기 탭
  const getInitialTab = () => (isMyPage ? 'profile' : isCompany ? 'posts' : 'profile');
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 대표 배지 (상단 표시)
  const [repBadge, setRepBadge] = useState<{ id: number | null; url: string | null }>({ id: null, url: null });
  const handleRepChange = useCallback((p: { badgeId: number | null; badgeUrl: string | null }) => {
    setRepBadge(prev => (prev.id === p.badgeId && prev.url === p.badgeUrl ? prev : { id: p.badgeId, url: p.badgeUrl }));
  }, []);

  const handleProfileSave = (newNickname: string, newBlogUrl: string, newGithubUrl?: string) => {
    // TODO: 프로필 저장 로직
  };

  const [userStats] = useState<UserStats>({
    posts: 15, comments: 42, followers: 128, likes: 256, views: 3200, bugReports: 5,
    tagCounts: { SPRING: 12, REACT: 8, AI: 4, DB: 15, AWS: 11 },
    hasFirstPost: true, hasFirstComment: true, isRegistered: true,
  });

  /** ========== 팔로우 상태 관리 ========== **/
  // TODO: 실제 로그인 사용자 ID로 바꿔주세요.
  const getCurrentUserId = () => 1;
  const currentUserId = getCurrentUserId();

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
        if (!isCompany && targetMemberId) {
          const id = await findMemberFollowId(currentUserId, targetMemberId);
          if (!ignore) { setMemberFollowId(id); setIsFollowing(!!id); }
        } else if (isCompany && targetCompanyId) {
          const id = await findCompanyFollowId(currentUserId, targetCompanyId);
          if (!ignore) { setCompanyFollowId(id); setIsFollowing(!!id); }
        }
      } catch (e) {
        console.error('팔로우 상태 조회 실패:', e);
      }
    }
    init();
    return () => { ignore = true; };
  }, [isCompany, isMyPage, targetMemberId, targetCompanyId, currentUserId]);

  // 팔/언팔 토글
  const handleFollowToggle = useCallback(async () => {
    if (isMyPage) return;

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
          const idToDelete = memberFollowId ?? (targetMemberId ? await findMemberFollowId(currentUserId, targetMemberId) : null);
          if (idToDelete) await deleteMemberFollow(idToDelete);
          setMemberFollowId(null);
        } else {
          const idToDelete = companyFollowId ?? (targetCompanyId ? await findCompanyFollowId(currentUserId, targetCompanyId) : null);
          if (idToDelete) await deleteCompanyFollow(idToDelete);
          setCompanyFollowId(null);
        }
      }
    } catch (e : any) {
      console.error('팔로우/언팔 실패:', e);
      setIsFollowing(prev => !prev); // 롤백
      alert(e?.message || '팔로우 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [isCompany, isMyPage, isFollowing, memberFollowId, companyFollowId, targetMemberId, targetCompanyId, currentUserId]);

  /** ========== 기업 데이터 (기업 상단 카드) ========== **/
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCompany) {
      setLoading(true);
      getCompany(routeId)
        .then((res) => setCompany(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isCompany, routeId]);

  return (
    <div className="max-w-[1232px] mx-auto px-4 py-8">
      <div className="max-w-[1232px] mx-auto">
        <ProfileHeader
          isCompany={isCompany}
          isMyPage={isMyPage}
          lastUpdate={isCompany ? (company?.lastUpdatedAt ? company.lastUpdatedAt.split('T')[0] : '') : '2025-07-30'}
          onFollowToggle={handleFollowToggle}
          isFollowing={isFollowing}
          onEditClick={() => setIsEditModalOpen(true)}
          repBadgeUrl={repBadge.url}
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
            initialNickname=""
            initialBlogUrl=""
            initialGithubUrl=""
            onSave={handleProfileSave}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
