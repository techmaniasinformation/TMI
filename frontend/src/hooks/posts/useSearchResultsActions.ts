import { useCallback, useEffect, useRef } from 'react';
import { fetchSearchData, transformApiPostToPost } from '@/api/post/searchApiService';
import { extractSearchConditions, hasSearchConditions } from '@/utils/searchUtils';
import type { useSearchResultsState } from './useSearchResultsState';

interface UseSearchResultsActionsProps {
  searchParams: URLSearchParams;
  state: ReturnType<typeof useSearchResultsState>;
}

// 검색 결과 액션 핸들러 훅
export const useSearchResultsActions = ({ searchParams, state }: UseSearchResultsActionsProps) => {
  const { setState } = state;
  const abortControllerRef = useRef<AbortController | null>(null);

  // 검색 실행 함수
  const executeSearch = useCallback(async () => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // URL 파라미터에서 검색 조건 추출
    const searchConditions = extractSearchConditions(searchParams);
    const { keyword, techTags, companyTags, currentPage } = searchConditions;

    // 검색 조건이 있는지 확인
    const hasConditions = hasSearchConditions(keyword, techTags, companyTags);

    if (!hasConditions) {
      setState(prev => ({
        ...prev,
        searchState: 'idle',
        loading: false,
        error: null,
        posts: [],
        totalCount: 0,
        appliedFilters: null
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      searchState: 'loading',
      loading: true,
      error: null
    }));

    try {
      const response = await fetchSearchData(
        {
          keyword,
          techTagIds: techTags,
          companyTagIds: companyTags,
          page: currentPage,
          size: 10
        },
        abortController
      );

      if (response.status !== 'SUCCESS') {
        throw new Error(`검색 API 응답이 성공하지 않았습니다. (${response.status})`);
      }

      const { posts: apiPosts, pageInfo, appliedFilters: responseFilters } = response.data;

      if (!apiPosts || !Array.isArray(apiPosts)) {
        throw new Error('검색 결과 데이터 형식이 올바르지 않습니다.');
      }

      const transformedPosts = (apiPosts || []).map(transformApiPostToPost);
      const totalElements = pageInfo?.totalElements ?? 0;
      
      // appliedFilters 설정
      const finalFilters = {
        q: responseFilters?.q ?? searchConditions.keyword ?? '',
        techTags: responseFilters?.techTags ?? [],
        companyTags: responseFilters?.companyTags ?? []
      };

      setState(prev => ({
        ...prev,
        posts: transformedPosts,
        totalCount: totalElements,
        appliedFilters: finalFilters,
        searchState: totalElements === 0 ? 'no-results' : 'success',
        loading: false
      }));

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        searchState: 'error',
        loading: false,
        posts: [],
        totalCount: 0,
        appliedFilters: null
      }));
    }
  }, [searchParams, setState]);

  // 검색 조건 변경 시 검색 실행
  useEffect(() => {
    executeSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeSearch]);

  return {
    executeSearch,
  };
};
