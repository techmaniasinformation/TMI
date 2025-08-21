import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import ProfileHeader from '@/components/layout/mypage/ProfileHeader';
import MyPageTabs from '@/components/layout/mypage/MypageTabs';
import ProfileEditModal from '@/components/layout/mypage/ProfileEditModal';

import { useProfileManagement } from '@/hooks/mypage/useProfileManagement';
import { useFollowManagement } from '@/hooks/mypage/useFollowManagement';
import { useCompanyData } from '@/hooks/mypage/useCompanyData';
import { useAuth } from '@/hooks/store/useStoreActions';

import type { MyTab } from '@/components/layout/mypage/MypageTabs';

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
  const { id } = useParams();
  const routeId = Number(id) || 0;

  const { user } = useAuth();
  const myId = user?.memberId;

  // 내 페이지 여부 계산
  const isMyPage = !!(myId && myId > 0 && myId === routeId);

  // 커스텀 훅들 사용
  const { modalInit, nicknameDaysLeft, refreshKey, handleProfileSave } = useProfileManagement(
    isMyPage,
    myId,
    isCompany
  );
  const followManagement = useFollowManagement(
    isMyPage,
    isCompany,
    routeId
  );
  const isFollowing = false;
  const handleFollowToggle = () => {};
  const { lastUpdateText } = useCompanyData(isCompany, routeId);

  // 초기 탭
  const [activeTab, setActiveTab] = useState<MyTab>('profile');
  useEffect(() => {
    setActiveTab(isMyPage ? 'profile' : (isCompany ? 'posts' : 'profile'));
  }, [isMyPage, isCompany]);

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

  return (
    <div className="max-w-[1232px] mx-auto px-4 py-8 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-[1232px] mx-auto">
        <ProfileHeader
          isCompany={isCompany}
          isMyPage={isMyPage}
          lastUpdate={isCompany ? lastUpdateText : '2025-07-30'}
          onFollowToggle={handleFollowToggle}
          isFollowing={isFollowing}
          onEditClick={() => setIsEditModalOpen(true)}
          repBadgeUrl={repBadge.url}
          refreshKey={refreshKey}
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
            onSave={async () => {}}
          />
        )}
      </div>
    </div>
  );
};

export default MyPage;
