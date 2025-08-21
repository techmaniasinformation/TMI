
import React from 'react';
import SearchPostList from './search/SearchPostList';
import { useSearchResults } from '@/hooks/posts/useSearchResults';

interface SearchPostListContainerProps {
  searchKeyword: string;
  searchTechTags: string[];
  searchCompanyTags: string[];
}

const SearchPostListContainer: React.FC<SearchPostListContainerProps> = ({
  searchKeyword,
  searchTechTags,
  searchCompanyTags,
}) => {
  const searchResults = useSearchResults();
  const posts: any[] = [];
  const loading = false;
  const error = null;
  const totalCount = 0;
  const currentPage = 1;
  const totalPages = 1;
  const handlePageChange = () => {};
  const handlePostClick = () => {};

  return (
    <SearchPostList
      posts={posts}
      loading={loading}
      error={error}
      totalCount={totalCount}
      onPostClick={handlePostClick}
    />
  );
};

export default SearchPostListContainer; 