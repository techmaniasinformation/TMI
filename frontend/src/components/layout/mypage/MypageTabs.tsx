import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

// 대표 배지 수정 API
import { patchRepresentativeBadge } from "@/api/mypage/representativebadgeService";

// 기본 UI
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/domain/Tabs";

// 카드들
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';

// 아이콘
import IconTab1 from '@/assets/icons/IconTab1';
import IconTab2 from '@/assets/icons/IconTab2';
import IconTab3 from '@/assets/icons/IconTab3';
import IconTab4 from '@/assets/icons/IconTab4';
import IconTab5 from '@/assets/icons/IconTab5';

// 훅
import ServerPagination from '@/components/domain/ServerPagination';

// 배지
import ai from '@/assets/images/ai_1.png';
import amumu from '@/assets/images/amumu.png';
import aws from '@/assets/images/aws_1.png';
import db from '@/assets/images/db_1.png';
import fctmi from '@/assets/images/fctmi_1.png';
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
import view_50 from '@/assets/images/view1.png';   // view_50.png → view1.png
import view_100 from '@/assets/images/view2.png';  // view_100.png → view2.png
import view_1000 from '@/assets/images/view3.png'; // view_1000.png → view3.png

import lockedIcon from '@/assets/images/locked.png';

// badgeUrl → 실제 이미지 매핑
export const badgeImageMap: Record<string, string> = {
  'ai_1.png': ai,
  'amumu.png': amumu,
  'aws_1.png': aws,
  'db_1.png': db,
  'fctmi_1.png': fctmi,
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
  'view_50.png': view_50,
  'view_100.png': view_100,
  'view_1000.png': view_1000,
  'locked.png': lockedIcon,
};

// 배지 모달
import BadgeModal from '@/components/layout/mypage/BadgeModal';
import { fetchAllBadges, fetchMemberBadges } from "@/api/mypage/badgeService";

// API (게시글/댓글/스타)
import { getCompanyPosts } from "@/api/company/companyPost";
import { fetchStarredPosts } from "@/api/mypage/starService";
import { fetchMemberComments } from "@/api/mypage/commentService";
import { fetchMemberPosts } from "@/api/mypage/postService";

// 팔로우 목록 API (fetch)
import { getCompanyFollows, getMemberFollows } from '@/api/followService';

// 타입
import type { CompanyPost } from "@/types/company/companyPost";
import type { Post as StarPost } from "@/types/mypage/star";
import type { Comment } from "@/types/mypage/comment";
import type { MyPagePost } from "@/types/mypage/post";
import type { Badge, MemberBadge } from "@/types/mypage/badge";

// 선택 배지 타입: 기본 Badge + 사용자가 가진 정보(선택)
type SelectedBadge = Badge & {
  memberBadgeId?: number;
  receivedAt?: string | null;
  isRepresentative?: boolean;
};

export type MyTab = 'profile' | 'comments' | 'posts' | 'follow' | 'starred';

// props
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
  // 현재 화면이 개인(회사 아님)인지
  const isPersonal = !isCompany;
  const isOtherUser = isPersonal && !isMyPage;

  // URL 파라미터 (개인/기업 공통으로 id 사용)
  const { id } = useParams();
  const routeId = id ? Number(id) : 1;

  // 개인 화면에서 사용할 멤버ID / 기업 화면에서 사용할 기업ID
  const memberId = isPersonal ? routeId : 1; // TODO: 내 페이지면 auth에서 대체
  const companyId = isCompany ? routeId : null;

  // 숨길 배지 (예: 기본 빈 배지 22)
  const HIDDEN_BADGE_IDS = new Set<number>([22]);

  /* -----------------------------
   * 배지 관련 상태 및 동기화
   * ----------------------------- */
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [memberBadges, setMemberBadges] = useState<MemberBadge[]>([]);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<SelectedBadge | null>(null);
  
  function getBadgeNameByUrl(allBadges: Badge[], badgeUrl?: string | null): string | undefined {
    if (!badgeUrl) return undefined;
    // 파일명만 추출
    const file = badgeUrl.split('/').pop() || badgeUrl;
    // 전체 배지에서 파일명이 같은 항목 찾기 → name 반환
    const hit = allBadges.find(b => (b.badgeUrl.split('/').pop() || b.badgeUrl) === file);
    return hit?.name;
  }

  useEffect(() => {
    // 내 정보 or 타 유저의 개인 페이지에서만 배지 정보 로드
    if ((isMyPage || isOtherUser) && isPersonal && memberId) {
      // 전체 배지
      fetchAllBadges()
        .then(setAllBadges)
        .catch(console.error);

      // 해당 멤버 보유 배지
      fetchMemberBadges(memberId)
        .then(setMemberBadges)
        .catch(console.error);
    }
  }, [isMyPage, isOtherUser, isPersonal, memberId]);

  // 대표 배지 변경 시 상단(MyPage)과 동기화
  useEffect(() => {
    const rep = memberBadges.find((mb) => mb.isRepresentative);
    if (onRepresentativeBadgeChange) {
      if (rep) {
        const meta = allBadges.find((b) => b.badgeId === rep.badgeId);
        const url = meta?.badgeUrl ? badgeImageMap[meta.badgeUrl] : null;
        onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: url ?? null });
      } else {
        onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
      }
    }
  }, [memberBadges, allBadges, onRepresentativeBadgeChange]);

  /* -----------------------------
   * 댓글 탭
   * ----------------------------- */
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalElements, setCommentTotalElements] = useState(0);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal) {
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

  /* -----------------------------
   * 작성한 게시글 탭 (개인/기업)
   * ----------------------------- */
  // 개인
  const [memberPosts, setMemberPosts] = useState<MyPagePost[]>([]);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalElements, setPostTotalElements] = useState(0);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [currentPostPage, setCurrentPostPage] = useState(1);

  useEffect(() => {
    if (isPersonal && memberId) {
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

  // 기업
  const [companyPosts, setCompanyPosts] = useState<CompanyPost[]>([]);
  const [companyPostTotalPages, setCompanyPostTotalPages] = useState(1);
  const [companyPostTotalElements, setCompanyPostTotalElements] = useState(0);
  const [companyPostLoading, setCompanyPostLoading] = useState(true);

  useEffect(() => {
    if (isCompany && companyId != null) {
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

  /* -----------------------------
   * 팔로우 탭 (목록 조회만)
   * ----------------------------- */
  const [followSubTab, setFollowSubTab] = useState<'company' | 'user'>('company');

  // 기업 팔로우 목록
  const [followedCompanies, setFollowedCompanies] = useState<any[]>([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(1);
  const [currentCompanyPage, setCurrentCompanyPage] = useState(1);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);

  // 개인 팔로우 목록
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [userTotalElements, setUserTotalElements] = useState(0);

  // 기업 팔로우 리스트 조회
  useEffect(() => {
    if (isMyPage && isPersonal) {
      getCompanyFollows(memberId, currentCompanyPage - 1, 9)
        .then((res) => {
          setFollowedCompanies(res.data.companyFollows);
          setTotalCompanyPages(res.data.pageInfo.totalPages);
          setCompanyTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentCompanyPage]);

  // 개인 팔로우 리스트 조회
  useEffect(() => {
    if (isMyPage && isPersonal) {
      getMemberFollows(memberId, currentUserPage - 1, 9)
        .then((res) => {
          setFollowedUsers(res.data.memberFollows);
          setTotalUserPages(res.data.pageInfo.totalPages);
          setUserTotalElements(res.data.pageInfo.totalElements);
        })
        .catch(console.error);
    }
  }, [isMyPage, isPersonal, memberId, currentUserPage]);

  /* -----------------------------
   * 스타 게시글 탭
   * ----------------------------- */
  const [starredPosts, setStarredPosts] = useState<StarPost[]>([]);
  const [starTotalPages, setStarTotalPages] = useState(1);
  const [starTotalElements, setStarTotalElements] = useState(0);
  const [starLoading, setStarLoading] = useState(true);
  const [starError, setStarError] = useState<string | null>(null);
  const [currentStarPage, setCurrentStarPage] = useState(1);

  useEffect(() => {
    if (isMyPage && isPersonal) {
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

  /* -----------------------------
   * 렌더링
   * ----------------------------- */
  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MyTab)} className='w-[1232px]'>
      {/* 탭 목록 */}
      <TabsList className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 w-full flex justify-start p-0 h-auto">
        {/* 내 정보 */}
        {(isMyPage || isOtherUser) && isPersonal && (
          <TabsTrigger value="profile" className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600">
            <IconTab1 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">내 정보</span>
          </TabsTrigger>
        )}

        {/* 작성한 댓글 (본인만) */}
        {isMyPage && isPersonal && (
          <TabsTrigger
            value="comments"
            className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
            onClick={() => setCurrentCommentPage(1)}
          >
            <IconTab2 className="w-4 h-4 mr-2 text-inherit" />
            <span className="text-sm">작성한 댓글 ({commentTotalElements})</span>
          </TabsTrigger>
        )}

        {/* 작성한 게시글 */}
        <TabsTrigger
          value="posts"
          className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
          onClick={() => setCurrentPostPage(1)}
        >
          <IconTab3 className="w-4 h-4 mr-2 text-inherit" />
          <span className="text-sm">
            작성한 게시글 ({isCompany ? companyPostTotalElements : postTotalElements})
          </span>
        </TabsTrigger>

        {/* 팔로우 / 스타 (본인만 노출) */}
        {isMyPage && isPersonal && (
          <>
            <TabsTrigger
              value="follow"
              className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => {
                setCurrentCompanyPage(1);
                setCurrentUserPage(1);
              }}
            >
              <IconTab4 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">팔로우</span>
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex items-center px-6 py-4 text-gray-500 border-b-2 border-transparent data-[state=active]:text-purple-600 data-[state=active]:border-purple-600"
              onClick={() => setCurrentStarPage(1)}
            >
              <IconTab5 className="w-4 h-4 mr-2 text-inherit" />
              <span className="text-sm">스타 게시글 ({starredPosts.length})</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {/* 내 정보 */}
      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsContent value="profile" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">업적</h2>
          <div className="grid grid-cols-7 gap-4">
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
                const matchedBadge = hasBadge ? memberBadges.find((mb) => mb.badgeId === badge.badgeId) : null;

                return (
                  <div
                    key={badge.badgeId}
                    onClick={hasBadge ? () => {
                      setSelectedBadge({
                        ...badge,
                        memberBadgeId: matchedBadge?.memberBadgeId,
                        receivedAt: matchedBadge?.receivedAt ?? null,
                        isRepresentative: matchedBadge?.isRepresentative ?? false,
                      });
                      setIsBadgeModalOpen(true);
                    } : undefined}
                    className={`aspect-square border rounded-xl shadow-sm flex flex-col items-center justify-center transition 
                      ${hasBadge ? 'cursor-pointer hover:shadow-md border-purple-600' : 'cursor-not-allowed border-gray-300 opacity-50'}`}
                  >
                    <img
                      src={hasBadge ? (badgeImageMap[badge.badgeUrl] || '/fallback.png') : badgeImageMap['locked.png']}
                      alt={badge.name}
                      className="w-20 h-20 mb-2 rounded-lg object-contain"
                    />
                    <p className="text-sm font-medium text-center text-gray-700">{badge.name}</p>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      )}

      {/* 댓글 */}
      {isMyPage && isPersonal && (
        <TabsContent value="comments" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">작성한 댓글</h2>
          {commentLoading ? (
            <p className="text-sm text-gray-500">불러오는 중...</p>
          ) : commentError ? (
            <p className="text-sm text-red-500">에러: {commentError}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500">작성한 댓글이 없습니다.</p>
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
      <TabsContent value="posts" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">작성한 게시글</h2>

        {isCompany ? (
          companyPostLoading ? (
            <p className="text-sm text-gray-500">불러오는 중...</p>
          ) : companyPosts.length === 0 ? (
            <p className="text-sm text-gray-500">게시글이 없습니다.</p>
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
          <p className="text-sm text-gray-500">불러오는 중...</p>
        ) : postError ? (
          <p className="text-sm text-red-500">에러: {postError}</p>
        ) : memberPosts.length === 0 ? (
          <p className="text-sm text-gray-500">게시글이 없습니다.</p>
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
        <TabsContent value="follow" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* 서브 탭 버튼 */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => {
                setFollowSubTab('company');
                setCurrentCompanyPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'company' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {/* 총합 보여주려면 companyTotalElements 사용 가능 */}
              기업 ({followedCompanies.length})
            </button>
            <button
              onClick={() => {
                setFollowSubTab('user');
                setCurrentUserPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                followSubTab === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {/* 총합 보여주려면 userTotalElements 사용 가능 */}
              개인 ({followedUsers.length})
            </button>
          </div>

          {/* 기업 팔로우 목록 */}
          {followSubTab === 'company' && (
            <>
              {followedCompanies.length === 0 ? (
                <p className="text-sm text-gray-500">팔로우한 기업이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 w-full max-w-full">
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
                  totalCount={companyTotalElements} // 정확한 총합
                  pageSize={9}
                  onPageChange={setCurrentCompanyPage}
                />
              )}
            </>
          )}

          {/* 개인 팔로우 목록 */}
          {followSubTab === 'user' && (
            <>
              {followedUsers.length === 0 ? (
                <p className="text-sm text-gray-500">팔로우한 유저가 없습니다.</p>
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
                  totalCount={userTotalElements} // 정확한 총합
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
        <TabsContent value="starred" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">스타 게시글</h2>

          {starLoading ? (
            <p className="text-sm text-gray-500">불러오는 중...</p>
          ) : starError ? (
            <p className="text-sm text-red-500">에러: {starError}</p>
          ) : starredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">스타한 게시글이 없습니다.</p>
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

      {/* 배지 모달 */}
      {isBadgeModalOpen && selectedBadge && (
        <BadgeModal
          isOpen={true}
          badge={selectedBadge}
          onClose={() => setIsBadgeModalOpen(false)}
          onRepresentativeSet={async () => {
            const updated = await fetchMemberBadges(memberId);
            setMemberBadges(updated);
            if (onRepresentativeBadgeChange) {
              const rep = updated.find(mb => mb.isRepresentative);
              if (rep) {
                const meta = allBadges.find(b => b.badgeId === rep.badgeId);
                const url = meta?.badgeUrl ? badgeImageMap[meta.badgeUrl] : null;
                onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: url ?? null });
              } else {
                onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
              }
            }
          }}
          onUnsetRepresentative={async () => {
            const fallback = memberBadges.find(mb => mb.badgeId === 22);
            if (!fallback?.memberBadgeId) {
              alert("기본 배지(22)를 보유하고 있지 않습니다.");
              return;
            }
            await patchRepresentativeBadge(fallback.memberBadgeId);
            alert("대표 배지를 기본 배지로 변경했습니다.");

            const updated = await fetchMemberBadges(memberId);
            setMemberBadges(updated);
            if (onRepresentativeBadgeChange) {
              const rep = updated.find(mb => mb.isRepresentative);
              if (rep) {
                const meta = allBadges.find(b => b.badgeId === rep.badgeId);
                const url = meta?.badgeUrl ? badgeImageMap[meta.badgeUrl] : null;
                onRepresentativeBadgeChange({ badgeId: rep.badgeId, badgeUrl: url ?? null });
              } else {
                onRepresentativeBadgeChange({ badgeId: null, badgeUrl: null });
              }
            }
          }}
        />
      )}
    </Tabs>
  );
};

export default MyPageTabs;