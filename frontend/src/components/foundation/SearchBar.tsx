import React, { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';
import Tag from '@/components/domain/article/Tag';
import TagArea from '@/components/domain/article/TagArea';
import { useTagAutocomplete, type AutocompleteTag } from '@/hooks/tags';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { createSearchParams } from '@/utils/searchUtils';

// SearchBar 스타일 정의
const searchBarVariants = cva(
  'w-full pl-10 pr-20 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  {
    variants: {
      variant: {
        light:
          'bg-light-bg border border-dark-bg text-dark-bg placeholder-gray-500',
        dark: 'bg-dark-bg border border-light-bg text-light-bg placeholder-gray-400',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

//드롭다운 스타일 정의
const dropdownVariants = cva(
  'absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50',
  {
    variants: {
      variant: {
        light: 'bg-light-bg border border-dark-bg text-light-bg',
        dark: 'bg-dark-bg border border-light-bg text-dark-bg',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
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
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [tagLimitError, setTagLimitError] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const { isDarkMode } = useThemeStore();

  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');
  const [selectedTags, setSelectedTags] = useState<AutocompleteTag[]>([]);
  
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

  const handleTagRemove = (tagName: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t.name !== tagName));
    setTagLimitError('');
  };

  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
    setShowRecentSearches(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
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
  };

  const matchedWords = searchKeyword.trim() === '' ? [] : suggestions;

  return (
    <div ref={containerRef} className='flex-1 max-w-2xl mx-8 relative'>
      <form onSubmit={handleSearchSubmit} className='relative'>
        <div className='relative'>
          <input
            type='text'
            value={searchKeyword}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder='기술 블로그 검색...'
            className={cn(searchBarVariants({ variant: activeVariant }))}
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <i
              className={cn(
                'fas fa-search',
                activeVariant === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}
            />
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center'>
            <button
              type='submit'
              disabled={searchKeyword.trim() === '' && selectedTags.length === 0}
              className={cn(
                'px-4 py-1 mr-1 text-sm font-medium rounded-md transition-colors',
                searchKeyword.trim() !== '' || selectedTags.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              )}
            >
              검색
            </button>
            
            {searchKeyword && (
              <button
                type='button'
                onClick={() => {
                  setSearchKeyword('');
                  setSearchError('');
                }}
                className='pr-3 flex items-center'
              >
                <i
                  className={cn(
                    'fas fa-times text-sm',
                    activeVariant === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                />
              </button>
            )}
          </div>
        </div>
        {searchError && (
          <p className='mt-1 text-sm text-red-500'>{searchError}</p>
        )}
      </form>

      {showSearchResults && (
        <div className={cn(dropdownVariants({ variant: activeVariant }))}>
          <div className='p-4'>
            <h3
              className={cn(
                'text-sm font-medium mb-2',
                isDarkMode ? 'text-light-header' : 'text-dark-header'
              )}
            >
              추천 검색어
            </h3>
            <div className='space-y-1 min-h-[40px]'>
              {tagLoading ? (
                <div className='p-2 text-sm text-gray-500 flex items-center gap-2'>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  태그 검색 중...
                </div>
              ) : tagApiError ? (
                <div className='p-2 text-sm text-red-500'>
                  {tagApiError}
                </div>
              ) : matchedWords.length > 0 ? (
                matchedWords.slice(0, 5).map((tag) => (
                  <div
                    key={`${tag.type}-${tag.id}`}
                    className={cn(
                      'p-2 hover:bg-gray-50 rounded cursor-pointer group flex items-center gap-2',
                      isDarkMode ? 'text-light-header hover:bg-gray-700' : 'text-dark-header hover:bg-gray-100'
                    )}
                    onClick={() => {
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
                    }}
                  >
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded text-white font-medium',
                      tag.type === 'tech' ? 'bg-blue-500' : 'bg-purple-500'
                    )}>
                      {tag.type === 'tech' ? 'T' : 'C'}
                    </span>
                    <span className={cn(
                      'text-sm flex-1',
                      isDarkMode
                        ? 'text-light-header group-hover:text-white'
                        : 'text-dark-header group-hover:text-black'
                    )}>
                      {tag.name}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {tag.type === 'tech' ? '기술' : '회사'}
                    </span>
                  </div>
                ))
              ) : searchKeyword.trim() !== '' && !tagLoading ? (
                <div className='p-2 text-sm text-gray-400'>
                  검색 결과가 없습니다
                </div>
              ) : searchKeyword.trim() === '' ? (
                <div className='p-2 text-sm text-gray-400'>
                  검색어를 입력해주세요
                </div>
              ) : (
                <div className='p-2 text-sm text-gray-400'> </div>
              )}
            </div>

            {selectedTags.length > 0 && (
              <div className='mt-4'>
                <hr className='my-3 border-gray-300 dark:border-gray-600' />
                <h3
                  className={cn(
                    'text-sm font-medium mb-2',
                    isDarkMode ? 'text-light-header' : 'text-dark-header'
                  )}
                >
                  선택된 태그
                </h3>

                <TagArea
                  tags={selectedTags.map(tag => tag.name)}
                  maxTags={5}
                  onRemoveTag={handleTagRemove}
                />
                {tagLimitError && (
                  <p className='mt-2 text-sm text-red-500'>{tagLimitError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
