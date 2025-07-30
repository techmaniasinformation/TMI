import React from 'react';
import PostList from '../article/PostList';
import { Post } from '@/types';

interface SearchPostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  onPostClick?: (postId: number) => void;
  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];
}

export default function SearchPostList({
  posts,
  loading,
  error,
  totalCount,
  onPostClick,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}: SearchPostListProps) {
  // 검색 조건이 있는지 확인 (빈 문자열이 아닌 경우도 포함)
  const hasSearchConditions = searchKeyword.trim() || searchTechTags.length > 0 || searchCompanyTags.length > 0;

  // 로딩 상태
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">검색 결과를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
        <p className="text-lg text-red-500 mb-2">검색 중 오류가 발생했습니다</p>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 검색 조건이 없는 경우
  if (!hasSearchConditions) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <p className="text-lg text-gray-600 mb-2">검색 조건을 입력해주세요</p>
        <p className="text-gray-500">키워드나 태그를 선택하여 검색해보세요</p>
      </div>
    );
  }

  // 검색 결과가 없는 경우 (검색 조건이 있고 결과가 0개일 때만)
  if (hasSearchConditions && totalCount === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
        <p className="text-lg text-gray-600 mb-2">검색 결과가 없습니다</p>
        <p className="text-gray-500">다른 검색 조건을 시도해보세요</p>
      </div>
    );
  }

  // 날짜 포맷팅 함수
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR');
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <PostList
      formatDate={formatDate}
      formatNumber={formatNumber}
      onPostClick={onPostClick}
      showThumbnail={true}
      maxTags={5}
      className="mb-8"
      posts={posts}
      searchKeyword={searchKeyword}
      searchTechTags={searchTechTags}
      searchCompanyTags={searchCompanyTags}
    />
  );
} 