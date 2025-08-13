// src/components/layout/mypage/MypageTabs.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';

import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';

import ServerPagination from '@/components/domain/ServerPagination';

// 이미지
import ai_1 from '@/assets/images/ai_1.png';
import amumu from '@/assets/images/amumu.png';
import aws_1 from '@/assets/images/aws_1.png';
import db_1 from '@/assets/images/db_1.png';
import fctmi_1 from '@/assets/images/fctmi_1.png';
import first_article from '@/assets/images/first_article.png';
import first_comment from '@/assets/images/first_comment.png';
import followmany from '@/assets/images/followmany.png';
import helloworld from '@/assets/images/helloworld.png';
import like10 from '@/assets/images/like10.png';
import like100 from '@/assets/images/like100.png';
import like1000 from '@/assets/images/like1000.png';
import paris from '@/assets/images/paris.png';
import react from '@/assets/images/react.png';
import spring from '@/assets/images/spring.png';
import star_5 from '@/assets/images/star_5.png';
import star_13 from '@/assets/images/star_13.png';
import star_42 from '@/assets/images/star_42.png';
import view1 from '@/assets/images/view1.png';
import view2 from '@/assets/images/view2.png';
import view3 from '@/assets/images/view3.png';
import locked from '@/assets/images/locked.png';

const badgeImages: Record<string, string> = {
  'ai_1.png': ai_1,
  'amumu.png': amumu,
  'aws_1.png': aws_1,
  'db_1.png': db_1,
  'fctmi_1.png': fctmi_1,
  'first_article.png': first_article,
  'first_comment.png': first_comment,
  'followmany.png': followmany,
  'helloworld.png': helloworld,
  'like10.png': like10,
  'like100.png': like100,
  'like1000.png': like1000,
  'paris.png': paris,
  'react.png': react,
  'spring.png': spring,
  'star_5.png': star_5,
  'star_13.png': star_13,
  'star_42.png': star_42,
  'view_50.png': view1,
  'view_100.png': view2,
  'view_1000.png': view3,
  'locked.png': locked,
};

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

  const HIDDEN_BADGE_IDS = new Set<number>([22]);

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
      <TabsList className="bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 w-full flex flex-wrap justify-start p-0 h-auto">
        {(isMyPage || isOtherUser) && isPersonal && (
          <TabsTrigger value="profile" className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
            <IconTab1 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">내 정보</span>
          </TabsTrigger>
        )}

        {isMyPage && isPersonal && (
          <TabsTrigger
            value="comments"
            className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
            onClick={() => setCurrentCommentPage(1)}
          >
            <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">작성한 댓글 ({commentTotalElements})</span>
          </TabsTrigger>
        )}

        <TabsTrigger
          value="posts"
          className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
          onClick={() => setCurrentPostPage(1)}
        >
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">
            작성한 게시글 ({isCompany ? companyPostTotalElements : postTotalElements})
          </span>
        </TabsTrigger>

        {isMyPage && isPersonal && (
          <>
            <TabsTrigger
              value="follow"
              className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => {
                setCurrentCompanyPage(1);
                setCurrentUserPage(1);
              }}
            >
              <IconTab4 className="w-4 h-4 mr-2 text-inherit" />
              {/* [FIX] 전체 개수로 표시 */}
              <span className="text-sm">팔로우 ({companyTotalElements + userTotalElements})</span>
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex items-center px-6 py-4 text-gray-500 dark:text-gray-400 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => setCurrentStarPage(1)}
            >
              <IconTab5 className="w-4 h-4 mr-2 text-inherit" />
              {/* [FIX] 페이지 전체 개수로 표시 */}
              <span className="text-sm">스타 게시글 ({starTotalElements})</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsContent value="profile" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">업적</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...allBadges]
              .filter((b) => !HIDDEN_BADGE_IDS.has(b.badgeId))
              .sort((a, b) => {
                const aHas = memberBadges.some((mb) => mb.badgeId === a.badgeId);
                const bHas = memberBadges.some((mb) => mb.badgeId === b.badgeId);
                if (aHas && !bHas) return -1;
                if (!aHas && bHas) return 1;
                return a.badgeId - b.badgeId;
              })
              .map((badge: Badge) => {
                const hasBadge = memberBadges.some((mb) => mb.badgeId === badge.badgeId);
                const matchedBadge = hasBadge
                  ? memberBadges.find((mb) => mb.badgeId === badge.badgeId)
                  : null;

                const handleClick = () => {
                  if (!canOpenBadgeModal || !hasBadge) return;
                  setSelectedBadge({
                    ...badge,
                    memberBadgeId: matchedBadge?.memberBadgeId,
                    receivedAt: matchedBadge?.receivedAt ?? null,
                    isRepresentative: matchedBadge?.isRepresentative ?? false,
                  });
                  setIsBadgeModalOpen(true);
                };

                return (
                  <div
                    key={badge.badgeId}
                    onClick={handleClick}
                    className={`aspect-square border rounded-xl shadow-sm flex flex-col items-center justify-center transition 
                      ${
                        hasBadge
                          ? (canOpenBadgeModal
                              ? 'cursor-pointer hover:shadow-md border-purple-600'
                              : 'cursor-default border-purple-600')
                          : 'cursor-not-allowed border-gray-300 dark:border-gray-600 opacity-50'
                      }`}
                    aria-disabled={!canOpenBadgeModal}
                    title={canOpenBadgeModal ? badge.name : undefined}
                  >
                    <img
                      src={hasBadge ? (badgeImages[badge.badgeUrl] || '/fallback.png') : (badgeImages['locked.png'] || '/fallback.png')}
                      alt={badge.name}
                      className="w-20 h-20 mb-2 rounded-lg object-contain"
                    />
                    <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-200">{badge.name}</p>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      )}

      {/* 댓글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="comments" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">작성한 댓글</h2>
          {commentLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
          ) : commentError ? (
            <p className="text-sm text-red-500 dark:text-red-400">에러: {commentError}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">작성한 댓글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  postTitle={comment.title}
                  comment={comment.comment}
                  date={comment.createAt}
                  onClick={() => window.location.href = `/post/${comment.postId}`}
                />
              ))}
            </div>
          )}
          {commentTotalPages > 1 && (
            <ServerPagination
              currentPage={currentCommentPage}
              totalCount={commentTotalElements}
              pageSize={5}
              onPageChange={setCurrentCommentPage}
            />
          )}
        </TabsContent>
      )}

      {/* 작성한 게시글 */}
      <TabsContent value="posts" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">작성한 게시글</h2>

        {isCompany ? (
          companyPostLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
          ) : companyPosts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">게시글이 없습니다.</p>
          ) : (
            <>
              <div className="space-y-4">
                {companyPosts.map((post) => (
                  <PostCard
                    key={post.postId}
                    post={{
                      id: post.postId,
                      title: post.title,
                      thumbnail: post.thumbnailUrl,
                      tags: post.tags,
                      views: post.viewCount,
                      stars: post.starCount,
                      comments: post.commentCount
                    }}
                    onClick={() => window.location.href = `/post/${post.postId}`}
                  />
                ))}
              </div>

              {companyPostTotalPages > 1 && (
                <ServerPagination
                  currentPage={currentPostPage}
                  totalCount={companyPostTotalElements}
                  pageSize={5}
                  onPageChange={setCurrentPostPage}
                />
              )}
            </>
          )
        ) : postLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
        ) : postError ? (
          <p className="text-sm text-red-500 dark:text-red-400">에러: {postError}</p>
        ) : memberPosts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">게시글이 없습니다.</p>
        ) : (
          <>
            <div className="space-y-4">
              {memberPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={{
                    id: post.postId,
                    title: post.title,
                    thumbnail: post.thumbnailUrl,
                    tags: post.tags,
                    views: post.viewCount,
                    stars: post.starCount,
                    comments: post.commentCount
                  }}
                  onClick={() => window.location.href = `/post/${post.postId}`}
                />
              ))}
            </div>

            {postTotalPages > 1 && (
              <ServerPagination
                currentPage={currentPostPage}
                totalCount={postTotalElements}
                pageSize={5}
                onPageChange={setCurrentPostPage}
              />
            )}
          </>
        )}
      </TabsContent>

      {/* 팔로우 */}
      {isMyPage && isPersonal && (
        <TabsContent value="follow" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => {
                setFollowSubTab('company');
                setCurrentCompanyPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
              }`}
            >
              {/* [FIX] 전체 개수로 표시 */}
              기업 ({companyTotalElements})
            </button>
            <button
              onClick={() => {
                setFollowSubTab('user');
                setCurrentUserPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
              }`}
            >
              {/* [FIX] 전체 개수로 표시 */}
              개인 ({userTotalElements})
            </button>
          </div>

          {followSubTab === 'company' && (
            <>
              {followedCompanies.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">팔로우한 기업이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full">
                  {followedCompanies.map((company) => (
                    <FollowCompanyCard
                      key={company.companyFollowId}
                      id={company.companyId}
                      name={company.name}
                      image={company.companyProfileUrl}
                      onClick={() => window.location.href = `/company/${company.companyId}`}
                    />
                  ))}
                </div>
              )}
              {totalCompanyPages > 1 && (
                <ServerPagination
                  currentPage={currentCompanyPage}
                  totalCount={companyTotalElements}
                  pageSize={9}
                  onPageChange={setCurrentCompanyPage}
                />
              )}
            </>
          )}

          {followSubTab === 'user' && (
            <>
              {followedUsers.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">팔로우한 유저가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 w-full max-w-full">
                  {followedUsers.map((user) => (
                    <FollowUserCard
                      key={user.memberFollowId}
                      id={user.memberId}
                      nickname={user.nickname}
                      image={user.memberProfileUrl}
                      badgeName={getBadgeNameByUrl(allBadges, user.badgeUrl)}
                      onClick={() => window.location.href = `/member/${user.memberId}`}
                    />
                  ))}
                </div>
              )}
              {totalUserPages > 1 && (
                <ServerPagination
                  currentPage={currentUserPage}
                  totalCount={userTotalElements}
                  pageSize={9}
                  onPageChange={setCurrentUserPage}
                />
              )}
            </>
          )}
        </TabsContent>
      )}

      {/* 스타 게시글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="starred" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">스타 게시글</h2>

          {starLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
          ) : starError ? (
            <p className="text-sm text-red-500 dark:text-red-400">에러: {starError}</p>
          ) : starredPosts.length === 0 ? (
            <p className="text_sm text-gray-500 dark:text-gray-400">스타한 게시글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {starredPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={{
                    id: post.postId,
                    title: post.title,
                    thumbnail: post.thumbnailUrl,
                    tags: post.tags,
                    views: post.viewCount,
                    stars: post.starCount,
                    comments: post.commentCount
                  }}
                  onClick={() => window.location.href = `/post/${post.postId}`}
                />
              ))}
            </div>
          )}

          {starTotalPages > 1 && (
            <ServerPagination
              currentPage={currentStarPage}
              totalCount={starTotalElements}
              pageSize={5}
              onPageChange={setCurrentStarPage}
            />
          )}
        </TabsContent>
      )}

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
