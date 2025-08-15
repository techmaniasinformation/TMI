import React from 'react';
import UserInfo from './UserInfo';
import DateTimeComponent from './DateTimeComponent';
import CardInfoCount from './CardInfoCount';
import TagArea from './TagArea';

// 게시글 데이터 타입
interface PostData {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string | null; // 백엔드에서 null이 올 수 있음
  tags: string[];
  date: string;
  views: number;
  stars: number;
  comments: number; // 댓글 수 추가
}

// 검색 하이라이트 타입
interface SearchHighlight {
  keyword?: string;
  techTags?: string[];
  companyTags?: string[];
}

// 포맷팅 함수 타입
interface FormattingFunctions {
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
}

// 표시 옵션 타입
interface DisplayOptions {
  maxTags?: number;
}

interface ArticleInfoProps extends PostData, SearchHighlight, FormattingFunctions, DisplayOptions {}

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
  comments,
  formatDate,
  formatNumber,
  maxTags = 5,
  keyword = '',
  techTags = [],
  companyTags = []
}: ArticleInfoProps) {
  return (
    <div className="flex-1">
      {/* 1. 작성자 정보 */}
      <UserInfo 
        profileImageUrl={authorProfile}
        nickname={author}
      >
        {authorBadge && (
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{authorBadge}</span>
        )}
      </UserInfo>
      
      {/* 2. 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 my-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words break-all">
        {title}
      </h3>
      
      {/* 3. 메타 정보 (날짜 + 조회수/좋아요) */}
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <DateTimeComponent 
          date={date}
          formatDate={formatDate}
        />
        <span>•</span>
        <CardInfoCount 
          viewCount={views}
          starCount={stars}
          commentCount={comments}
        />
      </div>
      
      {/* 4. 태그 영역 */}
      <TagArea 
        tags={tags}
        maxTags={maxTags}
        searchKeyword={keyword}
        searchTechTags={techTags}
        searchCompanyTags={companyTags}
      />
    </div>
  );
} 