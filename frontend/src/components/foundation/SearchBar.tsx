import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';
import Tag from '@/components/domain/article/Tag';
import TagArea from '@/components/domain/article/TagArea';

// SearchBar 스타일 정의
const searchBarVariants = cva(
  'w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const { isDarkMode } = useThemeStore(); // 다크모드 여부 확인

  //isDarkMode에 따라 variant 자동 설정
  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');

  // 검색어 추천용 딕셔너리 // db 정리되면 이것도 db랑 연결
  const dictionary = [
    'react',
    'javascript',
    'typescript',
    'python',
    'java',
    'node.js',
    'html',
    'css',
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setSearchQuery(value);
    setSearchError('');
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {

    setShowSearchResults(true); //포커스 시 무조건 드롭다운 보이게
    setShowRecentSearches(searchQuery.trim() === '');
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchError('검색어를 입력해주세요');
      setShowSearchResults(false);
      return;
    }
    addToRecentSearches(searchQuery);
    setShowSearchResults(true);
  };

  const matchedWords =
    searchQuery.trim() === ''
      ? [] // 입력값이 없으면 추천어 리스트는 비움
      : dictionary.filter((word) =>
          word.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className='flex-1 max-w-2xl mx-8 relative'>
      <form onSubmit={handleSearchSubmit} className='relative'>
        <div className='relative'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder='기술 블로그 검색...'
            className={cn(searchBarVariants({ variant: activeVariant }))}
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <i
              className={cn(
                'fas fa-search',
                activeVariant === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}
            ></i>
          </div>

          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
            >
              <i
                className={cn(
                  'fas fa-times',
                  activeVariant === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              ></i>
            </button>
          )}
        </div>
        {searchError && (
          <p className='mt-1 text-sm text-red-500'>{searchError}</p>
        )}
      </form>

      {(showSearchResults || showRecentSearches) && (
        <div className={cn(dropdownVariants({ variant: activeVariant }))}>
          {showRecentSearches && recentSearches.length > 0 && (
            <div className='p-4 border-b border-gray-100'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-medium text-gray-700'>
                  최근 검색어
                </h3>
                <button
                  onClick={() => removeFromRecentSearches('')}
                  className='text-xs text-gray-500 hover:text-gray-700'
                >
                  전체 삭제
                </button>
              </div>
              <div className='space-y-1'>
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 hover:bg-gray-50 rounded'
                  >
                    <span className='text-sm text-gray-700'>{term}</span>
                    <button
                      onClick={() => removeFromRecentSearches(term)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      <i className='fas fa-times text-xs'></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 검색어 없을 때도 추천 검색어 영역은 보이도록 */}
          <div className='p-4'>
            <h3
              className={cn(
                'text-sm font-medium mb-2',
                isDarkMode ? 'text-light-header' : 'text-dark-header' //다크모드에 맞게 제목 색상 변경
              )}
            >
              추천 검색어
            </h3>
            <div className='space-y-1 min-h-[40px]'>
              {matchedWords.length > 0 ? (
                matchedWords.map((word, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-2 hover:bg-gray-50 rounded cursor-pointer group',
                      isDarkMode ? 'text-light-header': 'text-dark-header'
                    )}
                    onClick={() => {
                      setSearchQuery(word);
                      addToRecentSearches(word);
                      setShowSearchResults(false);
                    }}
                  >
                    <span className={cn(
                      'text-sm text-gray-700',
                      isDarkMode ? 'text-light-header group-hover:text-dark-header' : 'text-dark-header'
                    )}>{word}</span>
                  </div>
                ))
              ) : (
                //빈칸만 표시
                <div className='p-2 text-sm text-gray-400'> </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
