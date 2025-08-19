import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import FollowCompanyCard from './FollowCompanyCard';
import FollowUserCard from './FollowUserCard';
import MypageBadgeGrid from './MypageBadgeGrid';
import ServerPagination from '@/components/domain/ServerPagination';

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
  followedCompanies: any[];
  followedUsers: any[];
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

const MypageTabContent: React.FC<MypageTabContentProps> = ({
  isCompany,
  isMyPage,
  isOtherUser,
  activeTab,
  
  // 배지 관련
  allBadges,
  memberBadges,
  canOpenBadgeModal,
  onBadgeClick,
  
  // 댓글 관련
  comments,
  commentLoading,
  commentError,
  commentTotalPages,
  commentTotalElements,
  currentCommentPage,
  setCurrentCommentPage,
  
  // 게시글 관련
  memberPosts,
  companyPosts,
  postLoading,
  postError,
  postTotalPages,
  postTotalElements,
  companyPostTotalPages,
  companyPostTotalElements,
  currentPostPage,
  setCurrentPostPage,
  
  // 팔로우 관련
  followSubTab,
  setFollowSubTab,
  followedCompanies,
  followedUsers,
  totalCompanyPages,
  totalUserPages,
  currentCompanyPage,
  currentUserPage,
  companyTotalElements,
  userTotalElements,
  setCurrentCompanyPage,
  setCurrentUserPage,
  
  // 스타 관련
  starredPosts,
  starLoading,
  starError,
  starTotalPages,
  starTotalElements,
  currentStarPage,
  setCurrentStarPage,
  
  // 유틸리티
  getBadgeNameByUrl,
}) => {
  const isPersonal = !isCompany;

  return (
    <>
      {/* 프로필 탭 */}
      {(isMyPage || isOtherUser) && isPersonal && (
        <TabsContent value="profile" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">업적</h2>
          <MypageBadgeGrid
            allBadges={allBadges}
            memberBadges={memberBadges}
            canOpenBadgeModal={canOpenBadgeModal}
            onBadgeClick={onBadgeClick}
          />
        </TabsContent>
      )}

      {/* 댓글 탭 */}
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

      {/* 게시글 탭 */}
      <TabsContent value="posts" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">작성한 게시글</h2>

        {isCompany ? (
          companyPosts.length === 0 ? (
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

      {/* 팔로우 탭 */}
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

      {/* 스타 탭 */}
      {isMyPage && isPersonal && (
        <TabsContent value="starred" className="p-6 bg-light-header dark:bg-dark-header border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">스타 게시글</h2>

          {starLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">불러오는 중...</p>
          ) : starError ? (
            <p className="text-sm text-red-500 dark:text-red-400">에러: {starError}</p>
          ) : starredPosts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">스타한 게시글이 없습니다.</p>
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
    </>
  );
};

export default MypageTabContent;

