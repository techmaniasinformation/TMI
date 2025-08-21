import React from 'react';
import { type AutocompleteTag } from '@/hooks/tags';

interface PostEditTagsProps {
  isAILoading: boolean;
  newTag: string;
  showTagSuggestions: boolean;
  tagError: string;
  tagLoading: boolean;
  tagSuggestions: AutocompleteTag[];
  tags: string[];
  handleTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTagKeyPress: (e: React.KeyboardEvent) => void;
  handleTagInputBlur: () => void;
  handleAddTag: (tagName?: string) => void;
  handleRemoveTag: (tagToRemove: string) => void;
}

const PostEditTags: React.FC<PostEditTagsProps> = ({
  isAILoading,
  newTag,
  showTagSuggestions,
  tagError,
  tagLoading,
  tagSuggestions,
  tags,
  handleTagInputChange,
  handleTagKeyPress,
  handleTagInputBlur,
  handleAddTag,
  handleRemoveTag,
}) => {
  if (isAILoading) {
    return (
      <div className="mt-12">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          태그
        </label>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">태그를 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        태그
      </label>
      
      {/* 태그 입력 영역 */}
      <div className="relative">
        <div className="mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTag}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
              onBlur={handleTagInputBlur}
              onFocus={() => newTag.trim() && true}
              placeholder="태그를 입력하세요 (기존 태그 검색 가능)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words break-all dark:bg-gray-800 dark:text-white"
            />
            <span className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-400">
              {newTag.length}/20
            </span>
          </div>
        </div>
        {tagError && <p className="text-sm text-red-500 mt-1">{tagError}</p>}
        
        {/* 태그 제안 드롭다운 */}
        {showTagSuggestions && (tagLoading || tagSuggestions.length > 0) && (
          <div className="absolute top-full left-0 right-12 bg-light-header dark:bg-dark-header border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {tagLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">검색 중...</span>
              </div>
            )}
            {tagSuggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                type="button"
                onClick={() => handleAddTag(suggestion.name)}
                disabled={tags.length >= 5}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500"
              >
                <span className="text-sm">{suggestion.name}</span>
              </button>
            ))}
            {!tagLoading && tagSuggestions.length === 0 && newTag.trim() && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                '
                <span className="font-medium">{newTag.trim()}</span>
                '에 대한 검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-blue-600 hover:text-blue-800 text-lg font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostEditTags;


