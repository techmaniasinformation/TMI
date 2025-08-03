import React, { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
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
  const [tagError, setTagError] = useState<string>(''); // &&& 추가: 태그 개수 제한 에러
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const { isDarkMode } = useThemeStore(); // 다크모드 여부 확인

  //isDarkMode에 따라 variant 자동 설정
  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');

  //각 태그 선택 여부
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 태그 삭제 핸들러 추가
  const handleTagRemove = (tag: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    setTagError(''); // &&& 태그 삭제 시 에러 메시지 초기화????
  };

  // 검색창 유지 시도
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
    <div ref={containerRef} className='flex-1 max-w-2xl mx-8 relative'>
      <form onSubmit={handleSearchSubmit} className='relative'>
        <div className='relative'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            // onBlur={handleSearchBlur}
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
                      isDarkMode ? 'text-light-header' : 'text-dark-header'
                    )}
                    onClick={() => {
                      // &&&&
                      if (selectedTags.length >= 5) {
                        // &&& 태그가 5개 이상일 경우
                        setTagError('검색 태그는 최대 5개 선택 가능합니다'); // &&& 에러 메시지 설정
                        return;
                      }
                      setSearchQuery('');
                      addToRecentSearches(word);
                      //선택 태그 추가
                      if (!selectedTags.includes(word)) {
                        setSelectedTags([...selectedTags, word]);
                      }
                      // 입력창에 포커스 유지
                      const inputElement =
                        document.querySelector<HTMLInputElement>(
                          'input[type="text"]'
                        );
                      inputElement?.focus();
                    }}
                  >
                    <span
                      className={cn(
                        'text-sm text-gray-700',
                        isDarkMode
                          ? 'text-light-header group-hover:text-dark-header'
                          : 'text-dark-header'
                      )}
                    >
                      {word}
                    </span>
                  </div>
                ))
              ) : (
                //빈칸만 표시
                <div className='p-2 text-sm text-gray-400'> </div>
              )}
            </div>

            {/* 선택된 태그 영역 */}
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
                {/* {tagError && ( // &&& 태그 제한 안내 표시
                  <p className='mt-2 text-sm text-red-500'>{tagError}</p>
                )} */}

                <TagArea
                  tags={selectedTags}
                  maxTags={5}
                  onRemoveTag={handleTagRemove} // 삭제 핸들러 전달
                />
                {tagError && ( // &&& 태그 제한 안내 표시
                  <p className='mt-2 text-sm text-red-500'>{tagError}</p>
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
