import React, { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';
import Tag from '@/components/domain/article/Tag';
import TagArea from '@/components/domain/article/TagArea';
import { useTagAutocomplete, type AutocompleteTag } from '@/hooks/tags';
import { useNavigate } from 'react-router-dom';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [tagLimitError, setTagLimitError] = useState<string>(''); // &&& 추가: 태그 개수 제한 에러
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const { isDarkMode } = useThemeStore(); // 다크모드 여부 확인

  //isDarkMode에 따라 variant 자동 설정
  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');

  //각 태그 선택 여부 - 타입 정보 포함
  const [selectedTags, setSelectedTags] = useState<AutocompleteTag[]>([]);
  
  // 태그 자동완성 훅 사용
  const { 
    suggestions, 
    loading: tagLoading, 
    error: tagApiError, 
    searchTags, 
    clearSuggestions 
  } = useTagAutocomplete({
    minLength: 1,
    debounceMs: 300
  });

  // 태그 삭제 핸들러 추가
  const handleTagRemove = (tagName: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t.name !== tagName));
    setTagLimitError(''); // &&& 태그 삭제 시 에러 메시지 초기화????
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

  // 기존 하드코딩된 dictionary 제거 - 이제 실제 API 사용

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setSearchQuery(value);
    setSearchError('');
    setShowSearchResults(true);
    
    // 실시간 태그 검색 API 호출
    searchTags(value);
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
    
    // 검색어나 선택된 태그가 있는지 확인
    if (searchQuery.trim() === '' && selectedTags.length === 0) {
      setSearchError('검색어를 입력하거나 태그를 선택해주세요');
      setShowSearchResults(false);
      return;
    }
    
    // 검색어가 있으면 최근 검색어에 추가
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
    }
    
    // 검색 URL 파라미터 생성
    const searchParams = new URLSearchParams();
    
    // 검색어 추가
    if (searchQuery.trim()) {
      searchParams.set('q', searchQuery.trim());
    }
    
    // 기술 태그와 회사 태그 분리
    const techTags = selectedTags.filter(tag => tag.type === 'tech');
    const companyTags = selectedTags.filter(tag => tag.type === 'company');
    
    // 태그 ID들을 쉼표로 구분하여 추가
    if (techTags.length > 0) {
      searchParams.set('techTags', techTags.map(tag => tag.id.toString()).join(','));
    }
    
    if (companyTags.length > 0) {
      searchParams.set('companyTags', companyTags.map(tag => tag.id.toString()).join(','));
    }
    
    // 첫 번째 페이지로 설정
    searchParams.set('page', '1');
    
    // 검색 결과 페이지로 이동
    navigate(`/search?${searchParams.toString()}`);
    
    // 검색창 초기화
    setSearchQuery('');
    setSelectedTags([]);
    setShowSearchResults(false);
    setShowRecentSearches(false);
    clearSuggestions();
  };

  // API에서 받은 suggestions를 사용 (기존 하드코딩된 matchedWords 대체)
  const matchedWords = searchQuery.trim() === '' ? [] : suggestions;

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

          {/* 검색 버튼과 클리어 버튼 */}
          <div className='absolute inset-y-0 right-0 flex items-center'>
            {/* 검색 버튼 */}
            <button
              type='submit'
              disabled={searchQuery.trim() === '' && selectedTags.length === 0}
              className={cn(
                'px-4 py-1 mr-1 text-sm font-medium rounded-md transition-colors',
                searchQuery.trim() !== '' || selectedTags.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              )}
            >
              검색
            </button>
            
            {/* 클리어 버튼 - 검색어가 있을 때만 표시 */}
            {searchQuery && (
              <button
                type='button'
                onClick={() => {
                  setSearchQuery('');
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
                ></i>
              </button>
            )}
          </div>
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
              {/* 로딩 상태 표시 */}
              {tagLoading ? (
                <div className='p-2 text-sm text-gray-500 flex items-center gap-2'>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  태그 검색 중...
                </div>
              ) : tagApiError ? (
                <div className='p-2 text-sm text-red-500'>
                  {tagApiError}
                </div>
              ) : matchedWords.length > 0 ? (
                matchedWords.map((tag) => (
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
                      setSearchQuery('');
                      addToRecentSearches(tag.name);
                      
                      // 선택 태그 추가 (중복 방지)
                      if (!selectedTags.some(selectedTag => selectedTag.id === tag.id && selectedTag.type === tag.type)) {
                        setSelectedTags([...selectedTags, tag]);
                      }
                      
                      // 자동완성 목록 초기화
                      clearSuggestions();
                      
                      // 입력창에 포커스 유지
                      const inputElement = document.querySelector<HTMLInputElement>('input[type="text"]');
                      inputElement?.focus();
                    }}
                  >
                    {/* 태그 타입별 아이콘 */}
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
              ) : searchQuery.trim() !== '' ? (
                <div className='p-2 text-sm text-gray-400'>
                  검색 결과가 없습니다
                </div>
              ) : (
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
                  tags={selectedTags.map(tag => tag.name)}
                  maxTags={5}
                  onRemoveTag={handleTagRemove} // 삭제 핸들러 전달
                />
                {tagLimitError && ( // &&& 태그 제한 안내 표시
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
