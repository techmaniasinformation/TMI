
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
  const keyword = searchParams.get('q') ?? searchParams.get('keyword') ?? '';
  const techTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
  const companyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];

  // 검색 조건이 있는지 확인
  const hasSearchConditions = keyword.trim() || techTags.length > 0 || companyTags.length > 0;
  
  console.log('🔍 [SearchPostListContainer] 검색 조건:', {
    keyword,
    techTags,
    companyTags,
    hasSearchConditions,
    totalCount,
    postsLength: posts.length
  });

  // 키워드 제거
  const handleRemoveKeyword = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');
    newSearchParams.delete('keyword'); // 호환성을 위해 둘 다 제거
    setSearchParams(newSearchParams);
  };

  // 기술 태그 제거
  const handleRemoveTechTag = (tagName: string) => {
    console.log('🔍 [handleRemoveTechTag] 태그 제거 시도:', {
      tagName,
      currentTechTags: searchParams.get('techTags'),
      appliedFiltersTechTags: appliedFilters?.techTags
    });
    
    const newSearchParams = new URLSearchParams(searchParams);
    const currentTechTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
    
    // appliedFilters에서 해당 태그 이름의 인덱스를 찾아서 URL에서 제거
    const tagIndex = appliedFilters?.techTags?.findIndex(t => t === tagName);
    console.log('🔍 [handleRemoveTechTag] 찾은 인덱스:', tagIndex);
    
    if (tagIndex !== undefined && tagIndex >= 0) {
      const updatedTechTags = currentTechTags.filter((_, index) => index !== tagIndex);
      console.log('🔍 [handleRemoveTechTag] 업데이트된 태그:', updatedTechTags);
      
      if (updatedTechTags.length > 0) {
        newSearchParams.set('techTags', updatedTechTags.join(','));
      } else {
        newSearchParams.delete('techTags');
      }
      setSearchParams(newSearchParams);
    }
  };

  // 회사 태그 제거
  const handleRemoveCompanyTag = (companyName: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const currentCompanyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];
    
    // appliedFilters에서 해당 회사 이름의 인덱스를 찾아서 URL에서 제거
    const companyIndex = appliedFilters?.companyTags?.findIndex(c => c === companyName);
    if (companyIndex !== undefined && companyIndex >= 0) {
      const updatedCompanyTags = currentCompanyTags.filter((_, index) => index !== companyIndex);
      
      if (updatedCompanyTags.length > 0) {
        newSearchParams.set('companyTags', updatedCompanyTags.join(','));
      } else {
        newSearchParams.delete('companyTags');
      }
      setSearchParams(newSearchParams);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 1. 검색 결과 바 - 검색 조건이 있을 때만 표시 */}
      {hasSearchConditions && appliedFilters && (
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
        searchTechTags={appliedFilters?.techTags ?? []}
        searchCompanyTags={appliedFilters?.companyTags ?? []}
      />

      {/* 3. 페이지네이션 - 검색 조건이 있을 때만 표시 */}
      {hasSearchConditions && (
        <ServerPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={10}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 