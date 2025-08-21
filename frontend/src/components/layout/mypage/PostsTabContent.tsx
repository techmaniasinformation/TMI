import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import ServerPagination from '@/components/domain/ServerPagination';
import type { MyPagePost } from "@/types/mypage/post";
import type { CompanyPost } from "@/types/company/companyPost";

interface PostsTabContentProps {
  isCompany: boolean;
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
}

const PostsTabContent: React.FC<PostsTabContentProps> = ({
  isCompany,
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
}) => {
  return (
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
  );
};

export default PostsTabContent;
