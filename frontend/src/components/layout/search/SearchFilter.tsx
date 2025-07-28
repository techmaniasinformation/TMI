import React from 'react';
import { Input, Button, Tag } from '@/components';

interface SearchFilterProps {
  keyword: string;
  selectedTags: string[];
  availableTags: string[];
  onKeywordChange: (keyword: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  keyword,
  selectedTags,
  availableTags,
  onKeywordChange,
  onTagToggle,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="space-y-4">
        {/* 검색어 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            검색어
          </label>
          <Input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 태그 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그 필터
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  selectedTags.includes(tag) ? 'bg-blue-100 border-blue-300' : ''
                }`}
                onClick={() => onTagToggle(tag)}
              />
            ))}
          </div>
        </div>

        {/* 필터 초기화 */}
        {(keyword || selectedTags.length > 0) && (
          <div className="flex justify-end">
            <Button onClick={onClearFilters} variant="outline" size="sm">
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter; 