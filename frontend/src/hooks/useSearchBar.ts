import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/stores/themeStore';
import { useTagAutocomplete, type AutocompleteTag } from '@/hooks/tags';
import { ROUTES } from '@/router/routes';
import { createSearchParams } from '@/utils/searchUtils';

interface UseSearchBarProps {
  addToRecentSearches: (term: string) => void;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
}

export const useSearchBar = ({
  addToRecentSearches,
  recentSearches,
  removeFromRecentSearches,
}: UseSearchBarProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [tagLimitError, setTagLimitError] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [selectedTags, setSelectedTags] = useState<AutocompleteTag[]>([]);

  // 태그 자동완성 훅
  const { 
    suggestions, 
    loading: tagLoading, 
    error: tagApiError, 
    searchTags, 
    clearSuggestions,
    tagSearchResults
  } = useTagAutocomplete({
    minLength: 1,
    debounceMs: 300
  });

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색어 변경 처리
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setSearchKeyword(value);
    setSearchError('');
    
    if (value.trim()) {
      setShowSearchResults(true);
      setShowRecentSearches(false);
    } else {
      setShowSearchResults(false);
      setShowRecentSearches(true);
    }
    
    searchTags(value);
  }, [searchTags]);

  // 검색 포커스 처리
  const handleSearchFocus = useCallback(() => {
    setShowSearchResults(true);
    setShowRecentSearches(false);
  }, []);

  // 검색 블러 처리
  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  }, []);

  // 검색 제출 처리
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchKeyword.trim() === '' && selectedTags.length === 0) {
      setSearchError('검색어를 입력하거나 태그를 선택해주세요');
      setShowSearchResults(false);
      return;
    }
    
    if (searchKeyword.trim()) {
      addToRecentSearches(searchKeyword);
    }
    
    const techTags = selectedTags.filter(tag => tag.type === 'tech');
    const companyTags = selectedTags.filter(tag => tag.type === 'company');
    
    const searchParams = createSearchParams(
      searchKeyword.trim(),
      techTags.map(tag => Number(tag.id).toString()),
      companyTags.map(tag => Number(tag.id).toString()),
      1
    );
    
    const searchUrl = `${ROUTES.SEARCH}?${searchParams.toString()}`;
    navigate(searchUrl);
    
    setSearchKeyword('');
    setSelectedTags([]);
    setShowSearchResults(false);
    setShowRecentSearches(false);
    clearSuggestions();
  }, [searchKeyword, selectedTags, addToRecentSearches, navigate, clearSuggestions]);

  // 검색어 초기화
  const handleClearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchError('');
  }, []);

  // 태그 제거
  const handleTagRemove = useCallback((tagName: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t.name !== tagName));
    setTagLimitError('');
  }, []);

  // 태그 선택
  const handleTagSelect = useCallback((tag: AutocompleteTag) => {
    if (selectedTags.length >= 5) {
      setTagLimitError('검색 태그는 최대 5개 선택 가능합니다');
      return;
    }
    setSearchKeyword('');
    addToRecentSearches(tag.name);
    
    if (!selectedTags.some(selectedTag => selectedTag.id === tag.id && selectedTag.type === tag.type)) {
      setSelectedTags([...selectedTags, tag]);
    }
    
    clearSuggestions();
    
    const inputElement = document.querySelector<HTMLInputElement>('input[type="text"]');
    inputElement?.focus();
  }, [selectedTags, addToRecentSearches, clearSuggestions]);

  // 매칭된 단어들
  const matchedWords = searchKeyword.trim() === '' ? [] : suggestions;

  // 검색 버튼 비활성화 여부
  const isSearchDisabled = searchKeyword.trim() === '' && selectedTags.length === 0;

  return {
    // 상태
    searchKeyword,
    searchError,
    tagLimitError,
    showSearchResults,
    showRecentSearches,
    selectedTags,
    isDarkMode,
    tagLoading,
    tagApiError,
    matchedWords,
    isSearchDisabled,
    containerRef,

    // 이벤트 핸들러
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchSubmit,
    handleClearSearch,
    handleTagRemove,
    handleTagSelect,

    // 유틸리티
    clearSuggestions,
  };
};
