import { useSearchResultsState } from './useSearchResultsState';
import { useSearchResultsActions } from './useSearchResultsActions';
import { useSearchResultsUI } from './useSearchResultsUI';

interface SearchResults {
  posts: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: any;
  setCurrentPage: (page: number) => void;
  searchState: any;
  hasSearchConditions: boolean;
}

export const useSearchResults = (): SearchResults => {
  const ui = useSearchResultsUI();
  const state = useSearchResultsState();
  const actions = useSearchResultsActions({
    searchParams: ui.searchParams,
    state,
  });

  return {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    currentPage: ui.currentPage,
    totalCount: state.totalCount,
    appliedFilters: state.appliedFilters,
    setCurrentPage: ui.setCurrentPage,
    searchState: state.searchState,
    hasSearchConditions: ui.hasConditions
  };
}; 