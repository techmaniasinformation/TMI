import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { extractSearchConditions, hasSearchConditions } from '@/utils/searchUtils';

// 검색 결과 UI 훅
export const useSearchResultsUI = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색 조건 추출
  const searchConditions = useMemo(() => 
    extractSearchConditions(searchParams), [searchParams]
  );
  
  const { keyword, techTags, companyTags, currentPage } = searchConditions;

  // 검색 조건이 있는지 확인
  const hasConditions = useMemo(() => 
    hasSearchConditions(keyword, techTags, companyTags), 
    [keyword, techTags, companyTags]
  );

  // 페이지 변경 핸들러
  const setCurrentPage = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  return {
    searchParams,
    searchConditions,
    currentPage,
    hasConditions,
    setCurrentPage,
  };
};
