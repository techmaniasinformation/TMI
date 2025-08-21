
import React from 'react';
import { PopularPostItem } from './article/PopularPostItem';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';

const PopularPosts: React.FC = () => {
  const { posts: popularPosts, loading, error } = usePopularPosts();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">인기 게시글을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  if (!popularPosts || popularPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">인기 게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
              {popularPosts.map((post: any, index: number) => (
        <PopularPostItem 
          key={post.postId} 
          post={post} 
          index={index}
          formatNumber={(num: number) => num.toLocaleString()}
        />
      ))}
    </div>
  );
};

export { PopularPosts }; 