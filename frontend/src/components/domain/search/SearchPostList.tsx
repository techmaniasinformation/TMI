import React from 'react';
import PostList from '../article/PostList';
import { Post } from '@/types';

interface SearchPostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  onPostClick?: (postId: number) => void;
  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];
}

export default function SearchPostList({
  posts,
  loading,
  error,
  totalCount,
  onPostClick,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}: SearchPostListProps) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('ko-KR');
  const formatNumber = (num: number) => num.toLocaleString('ko-KR');

  return (
    <PostList
      formatDate={formatDate}
      formatNumber={formatNumber}
      onPostClick={onPostClick}
      showThumbnail={true}
      maxTags={5}
      className="mb-8"
      posts={posts}
      searchKeyword={searchKeyword}
      searchTechTags={searchTechTags}
      searchCompanyTags={searchCompanyTags}
    />
  );
}; 