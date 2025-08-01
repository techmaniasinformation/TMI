import React from 'react';
import { Link } from 'react-router-dom';
import UserInfo from './UserInfo';
import DateTimeComponent from './DateTimeComponent';
import CardInfoCount from './CardInfoCount';
import TagArea from './TagArea';

interface ArticleInfoProps {
  id: number;
  title: string;
  author: string;
  authorProfile?: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  maxTags?: number;
}

export default function ArticleInfo({
  id,
  title,
  author,
  authorProfile,
  authorBadge,
  tags,
  date,
  views,
  stars,
  formatDate,
  formatNumber,
  maxTags = 5
}: ArticleInfoProps) {
  return (
    <div className="flex-1">
      {/* 1. 작성자 정보 */}
      <UserInfo 
        profileImageUrl={authorProfile}
        nickname={author}
      >
        {authorBadge && (
          <span className="text-xs text-blue-600 font-medium">{authorBadge}</span>
        )}
      </UserInfo>
      
      {/* 2. 제목 */}
      <Link to={`/posts/${id}`} className="block">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </Link>
      
      {/* 3. 메타 정보 (날짜 + 조회수/좋아요) */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <DateTimeComponent 
          date={date}
          formatDate={formatDate}
        />
        <span>•</span>
        <CardInfoCount 
          viewCount={views}
          starCount={stars}
        />
      </div>
      
      {/* 4. 태그 영역 */}
      <TagArea 
        tags={tags}
        maxTags={maxTags}
      />
    </div>
  );
} 