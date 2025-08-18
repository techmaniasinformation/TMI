import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSearchBar } from '@/hooks/useSearchBar';
import SearchInput from './SearchInput';
import SearchDropdown from './SearchDropdown';
import SearchTagArea from './SearchTagArea';

interface SearchBarProps extends VariantProps<typeof SearchInput> {
  addToRecentSearches: (term: string) => void;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  addToRecentSearches,
  recentSearches,
  removeFromRecentSearches,
  variant,
}) => {
  const {
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
  } = useSearchBar({
    addToRecentSearches,
    recentSearches,
    removeFromRecentSearches,
  });

  return (
    <div ref={containerRef} className='flex-1 max-w-2xl mx-8 relative'>
      {/* 검색 입력 필드 */}
      <SearchInput
        searchKeyword={searchKeyword}
        isDarkMode={isDarkMode}
        isSearchDisabled={isSearchDisabled}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        variant={variant}
      />

      {/* 검색 에러 메시지 */}
      {searchError && (
        <p className='mt-1 text-sm text-red-500'>{searchError}</p>
      )}

      {/* 검색 결과 드롭다운 */}
      <SearchDropdown
        showSearchResults={showSearchResults}
        isDarkMode={isDarkMode}
        tagLoading={tagLoading}
        tagApiError={tagApiError}
        matchedWords={matchedWords}
        searchKeyword={searchKeyword}
        onTagSelect={handleTagSelect}
        variant={variant}
      />

      {/* 선택된 태그 영역 */}
      {showSearchResults && (
        <SearchTagArea
          selectedTags={selectedTags}
          tagLimitError={tagLimitError}
          isDarkMode={isDarkMode}
          onTagRemove={handleTagRemove}
        />
      )}
    </div>
  );
};

export default SearchBar;
