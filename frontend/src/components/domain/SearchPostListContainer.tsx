
import { useSearchParams } from 'react-router-dom';
import SearchResultBar from './search/SearchResultBar';
import SearchPostList from './search/SearchPostList';
import ServerPagination from './ServerPagination';
import { Post, AppliedFilters } from '@/types';
import { ROUTES } from '@/router/routes';
import { extractSearchConditions, removeTagFromParams } from '@/utils/searchUtils';
import { SearchResultSkeleton } from '@/components/foundation/Skeleton';
import { ErrorState, DefaultErrorActions } from '@/components/foundation/ErrorState';
import { EmptyState, SearchTips, NoResultsTips } from '@/components/foundation/EmptyState';

interface SearchPostListContainerProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  onPageChange: (page: number) => void;
  onPostClick?: (postId: string) => void;
  searchState: 'idle' | 'loading' | 'success' | 'error' | 'no-results';
  hasSearchConditions: boolean;
}

export default function SearchPostListContainer({
  posts,
  loading,
  error,
  currentPage,
  totalCount,
  appliedFilters,
  onPageChange,
  onPostClick,
  searchState,
  hasSearchConditions
}: SearchPostListContainerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색 조건 추출
  const { keyword, techTags, companyTags } = extractSearchConditions(searchParams);

  // 키워드 제거
  const handleRemoveKeyword = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');
    newSearchParams.delete('keyword');
    setSearchParams(newSearchParams);
  };

  // 기술 태그 제거
  const handleRemoveTechTag = (tagName: string) => {
    const newSearchParams = removeTagFromParams(searchParams, tagName, 'tech', appliedFilters);
    setSearchParams(newSearchParams);
  };

  // 회사 태그 제거
  const handleRemoveCompanyTag = (companyName: string) => {
    const newSearchParams = removeTagFromParams(searchParams, companyName, 'company', appliedFilters);
    setSearchParams(newSearchParams);
  };

  // 상태별 렌더링
  switch (searchState) {
    case 'idle':
      return (
        <EmptyState
          title="검색 조건을 입력해주세요"
          description="키워드를 입력하거나 태그를 선택하여 검색을 시작하세요"
          tips={<SearchTips />}
        />
      );

    case 'loading':
      return <SearchResultSkeleton />;

    case 'error':
      return (
        <ErrorState
          title="검색 중 오류가 발생했습니다"
          message={error || undefined}
          actions={<DefaultErrorActions />}
        />
      );

    case 'no-results':
      return (
        <div className="w-full max-w-4xl mx-auto">
          {hasSearchConditions && (
            <SearchResultBar
              totalCount={totalCount}
              appliedFilters={appliedFilters || {
                q: keyword,
                techTags: techTags,
                companyTags: companyTags
              }}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveTechTag={handleRemoveTechTag}
              onRemoveCompanyTag={handleRemoveCompanyTag}
            />
          )}

          <EmptyState
            title="검색 결과가 없습니다"
            description={`"${keyword || '선택된 태그'}"에 대한 검색 결과를 찾을 수 없습니다`}
            tips={<NoResultsTips keyword={keyword} />}
          />
        </div>
      );

    case 'success':
      return (
        <div className="w-full max-w-4xl mx-auto">
          {hasSearchConditions && (
            <SearchResultBar
              totalCount={totalCount}
              appliedFilters={appliedFilters || {
                q: keyword,
                techTags: techTags,
                companyTags: companyTags
              }}
              onRemoveKeyword={handleRemoveKeyword}
              onRemoveTechTag={handleRemoveTechTag}
              onRemoveCompanyTag={handleRemoveCompanyTag}
            />
          )}

          <SearchPostList
            posts={posts}
            loading={loading}
            error={error}
            totalCount={totalCount}
            onPostClick={onPostClick}
            searchKeyword={appliedFilters?.q ?? keyword}
            searchTechTags={appliedFilters?.techTags ?? []}
            searchCompanyTags={appliedFilters?.companyTags ?? []}
          />

          {hasSearchConditions && totalCount > 0 && (
            <ServerPagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={onPageChange}
            />
          )}
        </div>
      );

    default:
      return <SearchResultSkeleton />;
  }
}; 