import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

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

interface SearchInputProps extends VariantProps<typeof searchBarVariants> {
  searchKeyword: string;
  isDarkMode: boolean;
  isSearchDisabled: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchKeyword,
  isDarkMode,
  isSearchDisabled,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onSearchSubmit,
  onClearSearch,
  variant,
}) => {
  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');

  return (
    <form onSubmit={onSearchSubmit} className='relative'>
      <div className='relative'>
        <input
          type='text'
          value={searchKeyword}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
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
            disabled={isSearchDisabled}
            className={cn(
              'px-4 py-1 mr-1 text-sm font-medium rounded-md transition-colors',
              !isSearchDisabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            )}
          >
            검색
          </button>
          
          {searchKeyword && (
            <button
              type='button'
              onClick={onClearSearch}
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
    </form>
  );
};

export default SearchInput;


