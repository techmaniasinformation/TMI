// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchPostListContainer from '@/components/domain/SearchPostListContainer';
import { useSearchResults } from '@/hooks/posts/useSearchResults';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 검색 결과 관리
  const {
    posts,
    loading,
    error,
    currentPage,
    totalCount,
    appliedFilters,
    setCurrentPage
  } = useSearchResults();

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    // 상세 페이지 대신 홈페이지로 이동
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SearchPostListContainer
          posts={posts}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalCount={totalCount}
          appliedFilters={appliedFilters}
          onPageChange={setCurrentPage}
          onPostClick={handlePostClick}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;