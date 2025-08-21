// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchPostListContainer from '@/components/domain/SearchPostListContainer';
import { useSearchResults } from '@/hooks/posts/useSearchResults';
import { ROUTES } from '@/router/routes';

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
    setCurrentPage,
    searchState,
    hasSearchConditions
  } = useSearchResults();

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    // 상세 페이지로 이동 (ROUTES 상수 사용)
    navigate(ROUTES.POST.replace(':id', postId.toString()));
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <SearchPostListContainer
          searchKeyword=""
          searchTechTags={[]}
          searchCompanyTags={[]}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;