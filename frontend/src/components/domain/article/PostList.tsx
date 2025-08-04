import React, { useState, useEffect, useCallback } from 'react';
import ArticleInfo from './ArticleInfo';
import { Post } from '@/types';

interface PostListProps {
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onPostClick?: (id: number) => void;
  className?: string;
  showThumbnail?: boolean;
  maxTags?: number;
  posts: Post[]; // 서버에서 받은 현재 페이지 데이터
  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];
}

export default function PostList({
  formatDate,
  formatNumber,
  onPostClick,
  className = '',
  showThumbnail = true,
  maxTags = 5,
  posts,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}: PostListProps) {

  // 빈 결과 상태
  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p className="text-lg text-gray-500">게시글이 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map((post: Post) => (
        <div 
          key={post.postId} 
          className="group bg-light-header dark:bg-dark-header rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-4"
          onClick={() => onPostClick?.(post.postId)}
        >
          <div className="flex items-start gap-4">
            <ArticleInfo
              id={post.postId}
              title={post.title}
              author={post.name}
              authorProfile={post.memberProfileUrl}
              authorBadge={post.badgeUrl}
              tags={post.tags}
              date={post.createAt}
              views={post.viewCount}
              stars={post.starCount}
              formatDate={formatDate}
              formatNumber={formatNumber}
              maxTags={maxTags}
              keyword={searchKeyword}
              techTags={searchTechTags}
              companyTags={searchCompanyTags}
            />
            {showThumbnail && post.thumbnailUrl && (
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-r-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 