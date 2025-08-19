import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTagAutocomplete, type AutocompleteTag } from '@/hooks/tags';
import { ROUTES } from '@/router/routes';
import { createSearchParams } from '@/utils/searchUtils';
import type { useSearchBarState } from './useSearchBarState';

interface UseSearchBarEventsProps {
  addToRecentSearches: (term: string) => void;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
  state: ReturnType<typeof useSearchBarState>;
}

// 검색바 이벤트 핸들러 훅
export const useSearchBarEvents = ({
  addToRecentSearches,
  recentSearches,
  removeFromRecentSearches,
  state,
}: UseSearchBarEventsProps) => {
  const navigate = useNavigate();
  const {
    searchKeyword,
    selectedTags,
    setSearchKeyword,
    setSearchError,
    setTagLimitError,
    setShowSearchResults,
    setShowRecentSearches,
    setSelectedTags,
    containerRef,
  } = state;

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
  }, [containerRef, setShowSearchResults, setShowRecentSearches]);

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
  }, [setSearchKeyword, setSearchError, setShowSearchResults, setShowRecentSearches, searchTags]);

  // 검색 포커스 처리
  const handleSearchFocus = useCallback(() => {
    setShowSearchResults(true);
    setShowRecentSearches(false);
  }, [setShowSearchResults, setShowRecentSearches]);

  // 검색 블러 처리
  const handleSearchBlur = useCallback(() => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  }, [setShowSearchResults, setShowRecentSearches]);

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
  }, [
    searchKeyword,
    selectedTags,
    addToRecentSearches,
    navigate,
    clearSuggestions,
    setSearchError,
    setShowSearchResults,
    setSearchKeyword,
    setSelectedTags,
    setShowRecentSearches
  ]);

  // 검색어 초기화
  const handleClearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchError('');
  }, [setSearchKeyword, setSearchError]);

  // 태그 제거
  const handleTagRemove = useCallback((tagName: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t.name !== tagName));
    setTagLimitError('');
  }, [setSelectedTags, setTagLimitError]);

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
  }, [selectedTags, addToRecentSearches, clearSuggestions, setSearchKeyword, setSelectedTags, setTagLimitError]);

  return {
    // 태그 자동완성
    suggestions,
    tagLoading,
    tagApiError,
    clearSuggestions,
    tagSearchResults,

    // 이벤트 핸들러
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchSubmit,
    handleClearSearch,
    handleTagRemove,
    handleTagSelect,
  };
};
