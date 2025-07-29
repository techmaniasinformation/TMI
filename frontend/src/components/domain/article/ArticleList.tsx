import React, { useState, useEffect, useCallback } from 'react';
import ArticleInfo from './ArticleInfo';

interface Article {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  thumbnail?: string;
  isFollowing?: boolean;
}

interface ArticleListProps {
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  onArticleClick?: (id: number) => void;
  className?: string;
  showThumbnail?: boolean;
  maxTags?: number;
  posts: Article[]; // 서버에서 받은 현재 페이지 데이터
}

export default function ArticleList({
  formatDate,
  formatNumber,
  onArticleClick,
  className = '',
  showThumbnail = true,
  maxTags = 5,
  posts
}: ArticleListProps) {



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
      {posts.map((article: Article) => (
        <div 
          key={article.id} 
          className="bg-light-header dark:bg-dark-header rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer p-4"
          onClick={() => onArticleClick?.(article.id)}
        >
          <div className="flex items-start gap-4">
            <ArticleInfo
              id={article.id}
              title={article.title}
              author={article.author}
              authorProfile={article.authorProfile}
              authorBadge={article.authorBadge}
              tags={article.tags}
              date={article.date}
              views={article.views}
              stars={article.stars}
              formatDate={formatDate}
              formatNumber={formatNumber}
              maxTags={maxTags}
            />
            {showThumbnail && article.thumbnail && (
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={article.thumbnail}
                  alt={article.title}
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