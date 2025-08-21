// src/components/layout/mypage/MypageTabs.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

import { Tabs } from "@/components/domain/Tabs";
import MypageTabHeader from './MypageTabHeader';
import MypageTabContent from './MypageTabContent';
import BadgeModal from '@/components/layout/mypage/BadgeModal';

import { useBadgeManagement } from '@/hooks/mypage/useBadgeManagement';
import { useCommentManagement } from '@/hooks/mypage/useCommentManagement';
import { usePostManagement } from '@/hooks/mypage/usePostManagement';
import { useFollowManagement } from '@/hooks/mypage/useFollowManagement';
import { useStarManagement } from '@/hooks/mypage/useStarManagement';

export type MyTab = 'profile' | 'comments' | 'posts' | 'follow' | 'starred';

interface MyPageTabsProps {
  isCompany: boolean;
  isMyPage: boolean;
  activeTab: MyTab;
  setActiveTab: Dispatch<SetStateAction<MyTab>>;
  userStats: any;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onRepresentativeBadgeChange?: (payload: { badgeId: number | null; badgeUrl: string | null }) => void;
}

const MyPageTabs: React.FC<MyPageTabsProps> = ({
  isCompany,
  isMyPage,
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  onRepresentativeBadgeChange,
}) => {
  const isPersonal = !isCompany;
  const isOtherUser = isPersonal && !isMyPage;
  const canOpenBadgeModal = isMyPage && isPersonal;

  const { id } = useParams();
  const routeId = id ? Number(id) : 0;
  const memberId = isPersonal ? routeId : 0;
  const companyId = isCompany ? routeId : null;

  // 커스텀 훅들 사용
  const {
    allBadges,
    memberBadges,
    isBadgeModalOpen,
    selectedBadge,
    refetchMemberBadges,
    getBadgeNameByUrl,
    handleBadgeClick,
    handleBadgeModalClose,
  } = useBadgeManagement(isMyPage, isOtherUser, isPersonal, memberId, onRepresentativeBadgeChange);

  const {
    comments,
    commentTotalPages,
    commentTotalElements,
    commentLoading,
    commentError,
    currentCommentPage,
    setCurrentCommentPage,
  } = useCommentManagement(isMyPage, isPersonal, memberId);

  const {
    memberPosts,
    postTotalPages,
    postTotalElements,
    postLoading,
    postError,
    currentPostPage,
    setCurrentPostPage,
    companyPosts,
    companyPostTotalPages,
    companyPostTotalElements,
    companyPostLoading,
  } = usePostManagement(isPersonal, isCompany, memberId, companyId);

  const {
    followSubTab,
    setFollowSubTab,
    followedCompanies,
    totalCompanyPages,
    currentCompanyPage,
    companyTotalElements,
    setCurrentCompanyPage,
    followedUsers,
    totalUserPages,
    currentUserPage,
    userTotalElements,
    setCurrentUserPage,
  } = useFollowManagement(isMyPage, isPersonal, memberId);

  const {
    starredPosts,
    starTotalPages,
    starTotalElements,
    starLoading,
    starError,
    currentStarPage,
    setCurrentStarPage,
  } = useStarManagement(isMyPage, isPersonal, memberId);

  /* 렌더링 */
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as MyTab)}
      className="w-full max-w-[1232px] mx-auto"
    >
      <MypageTabHeader
        isCompany={isCompany}
        isMyPage={isMyPage}
        isOtherUser={isOtherUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        commentTotalElements={commentTotalElements}
        postTotalElements={postTotalElements}
        companyPostTotalElements={companyPostTotalElements}
        companyTotalElements={companyTotalElements}
        userTotalElements={userTotalElements}
        starTotalElements={starTotalElements}
        setCurrentCommentPage={setCurrentCommentPage}
        setCurrentPostPage={setCurrentPostPage}
        setCurrentCompanyPage={setCurrentCompanyPage}
        setCurrentUserPage={setCurrentUserPage}
        setCurrentStarPage={setCurrentStarPage}
      />

      <MypageTabContent
        isCompany={isCompany}
        isMyPage={isMyPage}
        isOtherUser={isOtherUser}
        activeTab={activeTab}
        
        // 배지 관련
        allBadges={allBadges}
        memberBadges={memberBadges}
        canOpenBadgeModal={canOpenBadgeModal}
        onBadgeClick={handleBadgeClick}
        
        // 댓글 관련
        comments={comments}
        commentLoading={commentLoading}
        commentError={commentError}
        commentTotalPages={commentTotalPages}
        commentTotalElements={commentTotalElements}
        currentCommentPage={currentCommentPage}
        setCurrentCommentPage={setCurrentCommentPage}
        
        // 게시글 관련
        memberPosts={memberPosts}
        companyPosts={companyPosts}
        postLoading={postLoading}
        postError={postError}
        postTotalPages={postTotalPages}
        postTotalElements={postTotalElements}
        companyPostTotalPages={companyPostTotalPages}
        companyPostTotalElements={companyPostTotalElements}
        currentPostPage={currentPostPage}
        setCurrentPostPage={setCurrentPostPage}
        
        // 팔로우 관련
        followSubTab={followSubTab}
        setFollowSubTab={setFollowSubTab}
        followedCompanies={followedCompanies}
        followedUsers={followedUsers}
        totalCompanyPages={totalCompanyPages}
        totalUserPages={totalUserPages}
        currentCompanyPage={currentCompanyPage}
        currentUserPage={currentUserPage}
        companyTotalElements={companyTotalElements}
        userTotalElements={userTotalElements}
        setCurrentCompanyPage={setCurrentCompanyPage}
        setCurrentUserPage={setCurrentUserPage}
        
        // 스타 관련
        starredPosts={starredPosts}
        starLoading={starLoading}
        starError={starError}
        starTotalPages={starTotalPages}
        starTotalElements={starTotalElements}
        currentStarPage={currentStarPage}
        setCurrentStarPage={setCurrentStarPage}
        
        // 유틸리티
        getBadgeNameByUrl={getBadgeNameByUrl}
      />

      {/* 배지 모달 */}
      {canOpenBadgeModal && isBadgeModalOpen && selectedBadge && (
        <BadgeModal
          isOpen={isBadgeModalOpen}
          badge={selectedBadge}
          onClose={handleBadgeModalClose}
          onRefetch={refetchMemberBadges}
          allMemberBadges={memberBadges.map(mb => ({
            badgeId: mb.badgeId,
            memberBadgeId: mb.memberBadgeId,
          }))}
        />
      )}
    </Tabs>
  );
};

export default MyPageTabs;
