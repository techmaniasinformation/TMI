// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { SearchConditions, PostCard, Pagination, NoResults } from '@/components/layout/search';
import { SearchCondition, Post } from '@/types/searchTypes';
import { formatDate, formatNumber } from '@/utils/searchUtils';
import { mockPosts } from '@/utils/searchData';

interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchConditions] = useState<SearchCondition>({
    keyword: 'React 개발',
    tags: ['프론트엔드', 'JavaScript', 'React'],
    company: '네이버'
  });

  const postsPerPage = 5;
  const totalPages = Math.ceil(mockPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = mockPosts.slice(startIndex, startIndex + postsPerPage);

  const handleRemoveSearchCondition = (type: 'keyword' | 'tag' | 'company', value?: string) => {
    console.log(`Remove ${type}: ${value}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Conditions */}
        <SearchConditions 
          searchConditions={searchConditions}
          onRemoveCondition={handleRemoveSearchCondition}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            검색 결과 ({mockPosts.length}개)
          </h1>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>최신순</option>
              <option>인기순</option>
              <option>조회수순</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              highlightedTags={searchConditions.tags}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* No Results */}
        {mockPosts.length === 0 && <NoResults />}
    </div>
  );
};

export default SearchPage;