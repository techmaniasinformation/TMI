import { useState, useRef } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import type { AutocompleteTag } from '@/hooks/tags';

// 검색바 상태 관리 훅
export const useSearchBarState = () => {
  const { isDarkMode } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [tagLimitError, setTagLimitError] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [selectedTags, setSelectedTags] = useState<AutocompleteTag[]>([]);

  return {
    // 상태
    searchKeyword,
    searchError,
    tagLimitError,
    showSearchResults,
    showRecentSearches,
    selectedTags,
    isDarkMode,
    containerRef,

    // 상태 설정
    setSearchKeyword,
    setSearchError,
    setTagLimitError,
    setShowSearchResults,
    setShowRecentSearches,
    setSelectedTags,
  };
};

