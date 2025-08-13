import React from 'react';
import { Post } from '@/types';

interface PopularPostItemProps {
  post: Post;
  index: number;
  formatNumber: (num: number) => string;
  onClick?: (postId: number) => void;
  className?: string;
}

export const PopularPostItem: React.FC<PopularPostItemProps> = ({
  post,
  index,
  formatNumber,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(post.postId);
    }
  };

  return (
    <div 
      className={`border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* 순위 */}
        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-semibold">
          {index + 1}
        </div>
        
        {/* 게시글 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 hover:text-blue-600 dark:hover:text-blue-400">
            {post.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{post.name}</span>
            <span>•</span>
            <span>⭐ {formatNumber(post.starCount)}</span>
            <span>•</span>
            <span>👁️ {formatNumber(post.viewCount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 