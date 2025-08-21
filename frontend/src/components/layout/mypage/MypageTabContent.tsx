import React from 'react';
import ProfileTabContent from './ProfileTabContent';
import CommentsTabContent from './CommentsTabContent';
import PostsTabContent from './PostsTabContent';
import FollowTabContent from './FollowTabContent';
import StarredTabContent from './StarredTabContent';

import type { Badge, MemberBadge } from "@/types/mypage/badge";
import type { Comment } from "@/types/mypage/comment";
import type { MyPagePost } from "@/types/mypage/post";
import type { CompanyPost } from "@/types/company/companyPost";
import type { Post as StarPost } from "@/types/mypage/star";

type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

interface FollowedCompany {
  companyId: number;
  companyName: string;
  companyProfileUrl?: string;
}

interface FollowedUser {
  memberId: number;
  nickname: string;
  memberProfileUrl?: string;
}

interface MypageTabContentProps {
  isCompany: boolean;
  isMyPage: boolean;
  isOtherUser: boolean;
  activeTab: string;
  
  // 배지 관련
  allBadges: Badge[];
  memberBadges: MemberBadge[];
  canOpenBadgeModal: boolean;
  onBadgeClick: (badge: SelectedBadge) => void;
  
  // 댓글 관련
  comments: Comment[];
  commentLoading: boolean;
  commentError: string | null;
  commentTotalPages: number;
  commentTotalElements: number;
  currentCommentPage: number;
  setCurrentCommentPage: React.Dispatch<React.SetStateAction<number>>;
  
  // 게시글 관련
  memberPosts: MyPagePost[];
  companyPosts: CompanyPost[];
  postLoading: boolean;
  postError: string | null;
  postTotalPages: number;
  postTotalElements: number;
  companyPostTotalPages: number;
  companyPostTotalElements: number;
  currentPostPage: number;
  setCurrentPostPage: React.Dispatch<React.SetStateAction<number>>;
  
  // 팔로우 관련
  followSubTab: 'company' | 'user';
  setFollowSubTab: React.Dispatch<React.SetStateAction<'company' | 'user'>>;
  followedCompanies: FollowedCompany[];
  followedUsers: FollowedUser[];
  totalCompanyPages: number;
  totalUserPages: number;
  currentCompanyPage: number;
  currentUserPage: number;
  companyTotalElements: number;
  userTotalElements: number;
  setCurrentCompanyPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentUserPage: React.Dispatch<React.SetStateAction<number>>;
  
  // 스타 관련
  starredPosts: StarPost[];
  starLoading: boolean;
  starError: string | null;
  starTotalPages: number;
  starTotalElements: number;
  currentStarPage: number;
  setCurrentStarPage: React.Dispatch<React.SetStateAction<number>>;
  
  // 유틸리티
  getBadgeNameByUrl: (all: Badge[], url?: string | null) => string | undefined;
}

const MypageTabContent: React.FC<MypageTabContentProps> = (props) => {
  const { isCompany, isMyPage, isOtherUser } = props;
  const isPersonal = !isCompany;

  return (
    <>
      {/* 프로필 탭 */}
      {(isMyPage || isOtherUser) && isPersonal && (
        <ProfileTabContent
          allBadges={props.allBadges}
          memberBadges={props.memberBadges}
          canOpenBadgeModal={props.canOpenBadgeModal}
          onBadgeClick={props.onBadgeClick}
        />
      )}

      {/* 댓글 탭 */}
      {isMyPage && isPersonal && (
        <CommentsTabContent
          comments={props.comments}
          commentLoading={props.commentLoading}
          commentError={props.commentError}
          commentTotalPages={props.commentTotalPages}
          commentTotalElements={props.commentTotalElements}
          currentCommentPage={props.currentCommentPage}
          setCurrentCommentPage={props.setCurrentCommentPage}
        />
      )}

      {/* 게시글 탭 */}
      <PostsTabContent
        isCompany={isCompany}
        memberPosts={props.memberPosts}
        companyPosts={props.companyPosts}
        postLoading={props.postLoading}
        postError={props.postError}
        postTotalPages={props.postTotalPages}
        postTotalElements={props.postTotalElements}
        companyPostTotalPages={props.companyPostTotalPages}
        companyPostTotalElements={props.companyPostTotalElements}
        currentPostPage={props.currentPostPage}
        setCurrentPostPage={props.setCurrentPostPage}
      />

      {/* 팔로우 탭 */}
      {isMyPage && isPersonal && (
        <FollowTabContent
          followSubTab={props.followSubTab}
          setFollowSubTab={props.setFollowSubTab}
          followedCompanies={props.followedCompanies}
          followedUsers={props.followedUsers}
          totalCompanyPages={props.totalCompanyPages}
          totalUserPages={props.totalUserPages}
          currentCompanyPage={props.currentCompanyPage}
          currentUserPage={props.currentUserPage}
          companyTotalElements={props.companyTotalElements}
          userTotalElements={props.userTotalElements}
          setCurrentCompanyPage={props.setCurrentCompanyPage}
          setCurrentUserPage={props.setCurrentUserPage}
          allBadges={props.allBadges}
          getBadgeNameByUrl={props.getBadgeNameByUrl}
        />
      )}

      {/* 스타 탭 */}
      {isMyPage && isPersonal && (
        <StarredTabContent
          starredPosts={props.starredPosts}
          starLoading={props.starLoading}
          starError={props.starError}
          starTotalPages={props.starTotalPages}
          starTotalElements={props.starTotalElements}
          currentStarPage={props.currentStarPage}
          setCurrentStarPage={props.setCurrentStarPage}
        />
      )}
    </>
  );
};

export default MypageTabContent;

