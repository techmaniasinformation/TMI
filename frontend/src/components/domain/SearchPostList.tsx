import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResultBar from './search/SearchResultBar';
import SearchPostList from './search/SearchPostList';
import ServerPagination from './ServerPagination';
import { Post, AppliedFilters } from '@/types';

interface SearchPostListContainerProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  onPageChange: (page: number) => void;
  onPostClick?: (postId: number) => void;
}

export default function SearchPostListContainer({
  posts,
  loading,
  error,
  currentPage,
  totalCount,
  appliedFilters,
  onPageChange,
  onPostClick
}: SearchPostListContainerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색 조건 추출
  const keyword = searchParams.get('keyword') ?? '';
  const techTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
  const companyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];

  // 검색 조건이 있는지 확인
  const hasSearchConditions = appliedFilters && (
    appliedFilters.q || 
    (appliedFilters.techTags && appliedFilters.techTags.length > 0) || 
    (appliedFilters.companyTags && appliedFilters.companyTags.length > 0)
  );

  // 디버깅을 위한 콘솔 로그
  console.log('🔍 SearchPostListContainer Debug:', {
    currentPage,
    totalCount,
    postsLength: posts.length,
    hasSearchConditions,
    appliedFilters,
    keyword,
    techTags,
    companyTags
  });

  // 키워드 제거
  const handleRemoveKeyword = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('keyword');
    setSearchParams(newSearchParams);
  };

  // 기술 태그 제거
  const handleRemoveTechTag = (tag: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentTechTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
    const updatedTechTags = currentTechTags.filter(t => t !== tag);
    
    if (updatedTechTags.length > 0) {
      newSearchParams.set('techTags', updatedTechTags.join(','));
    } else {
      newSearchParams.delete('techTags');
    }
    setSearchParams(newSearchParams);
  };

  // 회사 태그 제거
  const handleRemoveCompanyTag = (company: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentCompanyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];
    const updatedCompanyTags = currentCompanyTags.filter(c => c !== company);
    
    if (updatedCompanyTags.length > 0) {
      newSearchParams.set('companyTags', updatedCompanyTags.join(','));
    } else {
      newSearchParams.delete('companyTags');
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 1. 검색 결과 바 - 검색 조건이 있을 때만 표시 */}
      {hasSearchConditions && (
        <SearchResultBar
          totalCount={totalCount}
          appliedFilters={appliedFilters}
          onRemoveKeyword={handleRemoveKeyword}
          onRemoveTechTag={handleRemoveTechTag}
          onRemoveCompanyTag={handleRemoveCompanyTag}
        />
      )}

      {/* 2. 게시글 목록 */}
      <SearchPostList
        posts={posts}
        loading={loading}
        error={error}
        totalCount={totalCount}
        onPostClick={onPostClick}
        searchKeyword={keyword}
        searchTechTags={techTags}
        searchCompanyTags={companyTags}
      />

      {/* 3. 페이지네이션 - 항상 표시 (검색 조건이 없어도 기본 게시글 목록이므로) */}
      <ServerPagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={10}
        onPageChange={onPageChange}
      />
    </div>
  );
} 