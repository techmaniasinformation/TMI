import React from 'react';
import { Link } from 'react-router-dom';
import { UserInfo } from './UserInfo';
import { DateTimeComponent } from './DateTimeComponent';
import { CardInfoCount } from './CardInfoCount';
import { TagArea } from './TagArea';

interface ArticleInfoProps {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  maxTags?: number;
}

const ArticleInfo: React.FC<ArticleInfoProps> = ({
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
}) => {
  return (
    <div className="flex-1">
      {/* 1. 작성자 정보 */}
      <UserInfo 
        author={author}
        authorProfile={authorProfile}
        authorBadge={authorBadge}
      />
      
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
          views={views}
          stars={stars}
          formatNumber={formatNumber}
        />
      </div>
      
      {/* 4. 태그 영역 */}
      <TagArea 
        tags={tags}
        maxTags={maxTags}
      />
    </div>
  );
};

export { ArticleInfo }; 