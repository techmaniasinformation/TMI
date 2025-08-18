// src/components/layout/mypage/MypageTabs.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

import { Tabs } from "@/components/domain/Tabs";
import MypageTabHeader from './MypageTabHeader';
import MypageTabContent from './MypageTabContent';
import BadgeModal from '@/components/layout/mypage/BadgeModal';

// ✅ 통합 API 모듈 사용
import { fetchAllBadges } from "@/api/mypage/badgeService"; // (전체 메타가 별도 서비스에 있다면 유지)
import { fetchMemberBadges } from "@/api/mypage/badgeService";

import { getCompanyPosts } from "@/api/company/companyPost";
import { fetchStarredPosts } from "@/api/mypage/starService";
import { fetchMemberComments } from "@/api/mypage/commentService";
import { fetchMemberPosts } from "@/api/mypage/postService";

import { getCompanyFollows, getMemberFollows } from '@/api/followService';

import type { CompanyPost } from "@/types/company/companyPost";
import type { Post as StarPost } from "@/types/mypage/star";
import type { Comment } from "@/types/mypage/comment";
import type { MyPagePost } from "@/types/mypage/post";
import type { Badge, MemberBadge } from "@/types/mypage/badge";

type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

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
  // [FIX] 안전한 파싱 (기본값 0으로 가드)
  const routeId = id ? Number(id) : 0;

  // [FIX] 유효하지 않은 id일 때 0으로 두어 API 호출 가드
  const memberId = isPersonal ? routeId : 0;
  const companyId = isCompany ? routeId : null;



  // 배지 상태
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [memberBadges, setMemberBadges] = useState<MemberBadge[]>([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<SelectedBadge | null>(null);

  // 서버 재조회
  const refetchMemberBadges = async () => {
    if (!memberId) return;
    try {
      const list = await fetchMemberBadges(memberId);
      setMemberBadges(list);

      const rep = list.find((mb) => mb.isRepresentative);
      if (onRepresentativeBadgeChange) {
        if (rep) {
          const meta = allBadges.find((b) => b.badgeId === rep.badgeId);
          if (meta?.badgeUrl) {
            const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
            onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: badgeImage });
          } else {
            onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: null });
          }
        } else {
          onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  function getBadgeNameByUrl(all: Badge[], url?: string | null) {
    if (!url) return undefined;
    const file = url.split('/').pop() || url;
    const hit = all.find(b => (b.badgeUrl.split('/').pop() || b.badgeUrl) === file);
    return hit?.name;
  }

  // 초기 로드
  useEffect(() => {
    if ((isMyPage || isOtherUser) && isPersonal && memberId > 0) {
      fetchAllBadges().then(setAllBadges).catch(console.error);
      fetchMemberBadges(memberId).then(setMemberBadges).catch(console.error);
    }
  }, [isMyPage, isOtherUser, isPersonal, memberId]);

  // 대표배지 변경 → 상단 동기화
  useEffect(() => {
    const rep = memberBadges.find((mb) => mb.isRepresentative);
    if (onRepresentativeBadgeChange) {
      if (rep) {
        const meta = allBadges.find((b) => b.badgeId === rep.badgeId);
        if (meta?.badgeUrl) {
          const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
          onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: badgeImage });
        } else {
          onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: null });
        }
      } else {
        onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
      }
    }
  }, [memberBadges, allBadges, onRepresentativeBadgeChange]);

  /* 댓글 */
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalElements, setCommentTotalElements] = useState(0);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setCommentLoading(true);
      fetchMemberComments(memberId, currentCommentPage, 5)
        .then(({ comments, pageInfo }) => {
          setComments(comments);
          setCommentTotalPages(pageInfo.totalPages);
          setCommentTotalElements(pageInfo.totalElements);
        })
        .catch((err) => setCommentError(err.message))
        .finally(() => setCommentLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentCommentPage]);

  /* 작성한 게시글(개인/기업) */
  const [memberPosts, setMemberPosts] = useState<MyPagePost[]>([]);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalElements, setPostTotalElements] = useState(0);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [currentPostPage, setCurrentPostPage] = useState(1);

  useEffect(() => {
    if (isPersonal && memberId > 0) {
      setPostLoading(true);
      fetchMemberPosts(memberId, currentPostPage, 5)
        .then((res) => {
          setMemberPosts(res.data.posts);
          setPostTotalPages(res.data.pageInfo.totalPages);
          setPostTotalElements(res.data.pageInfo.totalElements);
        })
        .catch((err) => setPostError(err.message))
        .finally(() => setPostLoading(false));
    }
  }, [isPersonal, memberId, currentPostPage]);

  const [companyPosts, setCompanyPosts] = useState<CompanyPost[]>([]);
  const [companyPostTotalPages, setCompanyPostTotalPages] = useState(1);
  const [companyPostTotalElements, setCompanyPostTotalElements] = useState(0);
  const [companyPostLoading, setCompanyPostLoading] = useState(true);

  useEffect(() => {
    if (isCompany && companyId != null && companyId > 0) {
      setCompanyPostLoading(true);
      getCompanyPosts(companyId, currentPostPage, 5)
        .then((res) => {
          setCompanyPosts(res.data.posts);
          setCompanyPostTotalPages(res.data.pageInfo.totalPages);
          setCompanyPostTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error)
        .finally(() => setCompanyPostLoading(false));
    }
  }, [isCompany, companyId, currentPostPage]);

  /* 팔로우 */
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');
  const [followedCompanies, setFollowedCompanies] = useState<any[]>([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(1);
  const [currentCompanyPage, setCurrentCompanyPage] = useState(1);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);

  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [userTotalElements, setUserTotalElements] = useState(0);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getCompanyFollows(memberId, currentCompanyPage - 1, 9)
        .then((res) => {
          setFollowedCompanies(res.data.companyFollows);
          setTotalCompanyPages(res.data.pageInfo.totalPages);
          setCompanyTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentCompanyPage]);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      getMemberFollows(memberId, currentUserPage - 1, 9)
        .then((res) => {
          setFollowedUsers(res.data.memberFollows);
          setTotalUserPages(res.data.pageInfo.totalPages);
          setUserTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentUserPage]);

  /* 스타 게시글 */
  const [starredPosts, setStarredPosts] = useState<StarPost[]>([]);
  const [starTotalPages, setStarTotalPages] = useState(1);
  const [starTotalElements, setStarTotalElements] = useState(0);
  const [starLoading, setStarLoading] = useState(true);
  const [starError, setStarError] = useState<string | null>(null);
  const [currentStarPage, setCurrentStarPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal && memberId > 0) {
      setStarLoading(true);
      fetchStarredPosts(memberId, currentStarPage, 5)
        .then((res) => {
          setStarredPosts(res.data.posts);
          setStarTotalPages(res.data.pageInfo.totalPages);
          setStarTotalElements(res.data.pageInfo.totalElements);
        })
        .catch((err) => setStarError(err.message))
        .finally(() => setStarLoading(false));
    }
  }, [isMyPage, isPersonal, memberId, currentStarPage]);

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
        onBadgeClick={(badge) => {
          setSelectedBadge(badge);
          setIsBadgeModalOpen(true);
        }}
        
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

      {/* ✅ 배지 모달 */}
      {canOpenBadgeModal && isBadgeModalOpen && selectedBadge && (
        <BadgeModal
          isOpen={isBadgeModalOpen}
          badge={selectedBadge}
          onClose={() => setIsBadgeModalOpen(false)}
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
