import React from 'react';
import { TabsContent } from "@/components/domain/Tabs";
import PostCard from './PostCard';
import ServerPagination from '@/components/domain/ServerPagination';
import type { Post as StarPost } from "@/types/mypage/star";

interface StarredTabContentProps {
  starredPosts: StarPost[];
  starLoading: boolean;
  starError: string | null;
  starTotalPages: number;
  starTotalElements: number;
  currentStarPage: number;
  setCurrentStarPage: React.Dispatch<React.SetStateAction<number>>;
}

const StarredTabContent: React.FC<StarredTabContentProps> = ({
  starredPosts,
  starLoading,
  starError,
  starTotalPages,
  starTotalElements,
  currentStarPage,
  setCurrentStarPage,
}) => {
  return (
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
  );
};

export default StarredTabContent;
