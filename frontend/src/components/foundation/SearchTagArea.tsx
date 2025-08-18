import React from 'react';
import { cn } from '@/utils/utils';
import TagArea from '@/components/domain/article/TagArea';

interface SearchTagAreaProps {
  selectedTags: any[];
  tagLimitError: string;
  isDarkMode: boolean;
  onTagRemove: (tagName: string) => void;
}

const SearchTagArea: React.FC<SearchTagAreaProps> = ({
  selectedTags,
  tagLimitError,
  isDarkMode,
  onTagRemove,
}) => {
  if (selectedTags.length === 0) return null;

  return (
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
        onRemoveTag={onTagRemove}
      />
      {tagLimitError && (
        <p className='mt-2 text-sm text-red-500'>{tagLimitError}</p>
      )}
    </div>
  );
};

export default SearchTagArea;
