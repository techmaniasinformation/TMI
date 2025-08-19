import { useSearchBarState } from './search/useSearchBarState';
import { useSearchBarEvents } from './search/useSearchBarEvents';

interface UseSearchBarProps {
  addToRecentSearches: (term: string) => void;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
}

export const useSearchBar = (props: UseSearchBarProps) => {
  const state = useSearchBarState();
  const events = useSearchBarEvents({ ...props, state });

  // 매칭된 단어들
  const matchedWords = state.searchKeyword.trim() === '' ? [] : events.suggestions;

  // 검색 버튼 비활성화 여부
  const isSearchDisabled = state.searchKeyword.trim() === '' && state.selectedTags.length === 0;

  return {
    // 상태
    searchKeyword: state.searchKeyword,
    searchError: state.searchError,
    tagLimitError: state.tagLimitError,
    showSearchResults: state.showSearchResults,
    showRecentSearches: state.showRecentSearches,
    selectedTags: state.selectedTags,
    isDarkMode: state.isDarkMode,
    tagLoading: events.tagLoading,
    tagApiError: events.tagApiError,
    matchedWords,
    isSearchDisabled,
    containerRef: state.containerRef,

    // 이벤트 핸들러
    handleSearchChange: events.handleSearchChange,
    handleSearchFocus: events.handleSearchFocus,
    handleSearchBlur: events.handleSearchBlur,
    handleSearchSubmit: events.handleSearchSubmit,
    handleClearSearch: events.handleClearSearch,
    handleTagRemove: events.handleTagRemove,
    handleTagSelect: events.handleTagSelect,

    // 유틸리티
    clearSuggestions: events.clearSuggestions,
  };
};

