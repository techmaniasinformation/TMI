import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { type AutocompleteTag } from '@/hooks/tags';

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

interface SearchDropdownProps {
  showSearchResults: boolean;
  isDarkMode: boolean;
  tagLoading: boolean;
  tagApiError: string | null;
  matchedWords: AutocompleteTag[];
  searchKeyword: string;
  onTagSelect: (tag: AutocompleteTag) => void;
  variant?: 'light' | 'dark';
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  showSearchResults,
  isDarkMode,
  tagLoading,
  tagApiError,
  matchedWords,
  searchKeyword,
  onTagSelect,
  variant,
}) => {
  const activeVariant = (variant || (isDarkMode ? 'dark' : 'light')) as 'light' | 'dark';

  if (!showSearchResults) return null;

  return (
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
                onClick={() => onTagSelect(tag)}
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
      </div>
    </div>
  );
};

export default SearchDropdown;


