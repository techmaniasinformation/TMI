import { useState } from 'react';
import { Post, AppliedFilters } from '@/types';

// 검색 상태 타입 정의
export type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'no-results';

// 검색 결과 상태 관리 훅
export interface SearchResultsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  searchState: SearchState;
}

export const useSearchResultsState = () => {
  const [state, setState] = useState<SearchResultsState>({
    posts: [],
    loading: false,
    error: null,
    totalCount: 0,
    appliedFilters: null,
    searchState: 'idle'
  });

  return {
    // 상태
    ...state,

    // 상태 설정
    setState,
  };
};
