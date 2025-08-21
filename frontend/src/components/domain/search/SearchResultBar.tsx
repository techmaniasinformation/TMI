import React from 'react';
import { AppliedFilters } from '@/types';
import { Tag } from '../article/Tag';

interface SearchResultBarProps {
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  onRemoveKeyword: () => void;
  onRemoveTechTag: (tag: string) => void;
  onRemoveCompanyTag: (tag: string) => void;
}

export default function SearchResultBar({
  totalCount,
  appliedFilters,
  onRemoveKeyword,
  onRemoveTechTag,
  onRemoveCompanyTag
}: SearchResultBarProps) {
  if (!appliedFilters) {
    return null;
  }

  const hasFilters = appliedFilters.q || 
    (appliedFilters.techTags && appliedFilters.techTags.length > 0) || 
    (appliedFilters.companyTags && appliedFilters.companyTags.length > 0);

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        검색 결과 ({totalCount}개)
      </h1>
      
      {/* 검색 조건 배지 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {appliedFilters.q && (
          <Tag
            className="bg-yellow-100 text-yellow-800"
            onClick={onRemoveKeyword}
          >
            키워드: {appliedFilters.q}
          </Tag>
        )}
        {appliedFilters.techTags?.map((tag, index) => (
          <Tag
            key={index}
            className="bg-green-100 text-green-800"
            onClick={() => onRemoveTechTag(tag)}
          >
            {tag}
          </Tag>
        ))}
        {appliedFilters.companyTags?.map((company, index) => (
          <Tag
            key={index}
            className="bg-purple-100 text-purple-800"
            onClick={() => onRemoveCompanyTag(company)}
          >
            {company}
          </Tag>
        ))}
      </div>
    </div>
  );
} 