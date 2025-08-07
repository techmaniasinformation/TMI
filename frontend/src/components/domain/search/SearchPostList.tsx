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

  console.log('🔍 [SearchPostList] 렌더링 상태:', {
    loading,
    error,
    totalCount,
    postsLength: posts.length,
    hasSearchConditions,
    searchKeyword,
    searchTechTags,
    searchCompanyTags
  });

  // 로딩 상태 - 검색 조건이 있거나 초기 로딩일 때 표시
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 mb-2">검색 결과를 불러오는 중...</p>
        <p className="text-sm text-gray-400">잠시만 기다려주세요</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-red-600 mb-2">검색 중 오류가 발생했습니다</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">{error}</p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
          >
            <i className="fas fa-redo mr-2"></i>
            다시 시도
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            이전 페이지로
          </button>
        </div>
      </div>
    );
  }

  // 검색 조건이 없는 경우
  if (!hasSearchConditions) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">검색 조건을 입력해주세요</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            키워드를 입력하거나 태그를 선택하여 검색을 시작하세요
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-medium text-blue-800 mb-2">검색 팁</h4>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• 기술 키워드로 검색 (예: Python, React, Spring)</li>
            <li>• 기술 태그 선택으로 정확한 검색</li>
            <li>• 회사 태그로 특정 회사 게시물 검색</li>
            <li>• 여러 조건을 조합하여 검색</li>
          </ul>
        </div>
      </div>
    );
  }

  // 검색 결과가 없는 경우
  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500 mb-4">
            <span className="font-medium">"{searchKeyword || '선택된 태그'}"</span>에 대한 검색 결과를 찾을 수 없습니다
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-medium text-yellow-800 mb-2">다른 방법으로 검색해보세요</h4>
          <ul className="text-sm text-yellow-700 space-y-1 text-left">
            <li>• 다른 키워드나 태그로 검색</li>
            <li>• 검색어의 철자를 확인해보세요</li>
            <li>• 더 일반적인 키워드로 검색</li>
            <li>• 태그를 하나씩 제거해보세요</li>
          </ul>
        </div>
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
    <div>
      {/* 검색 결과 요약 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              검색 결과 ({totalCount.toLocaleString()}개)
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              {searchKeyword && `키워드: "${searchKeyword}"`}
              {searchTechTags.length > 0 && ` 기술태그: ${searchTechTags.join(', ')}`}
              {searchCompanyTags.length > 0 && ` 회사태그: ${searchCompanyTags.join(', ')}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">
              현재 {posts.length}개 표시 중
            </p>
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
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
    </div>
  );
} 