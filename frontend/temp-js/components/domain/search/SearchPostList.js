import React from 'react';
import PostList from '../article/PostList';
import { formatUTCToKSTDate } from '@/utils/dateUtils';
export default function SearchPostList({
  posts,
  loading,
  error,
  totalCount,
  onPostClick,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}) {
  const formatDate = date => formatUTCToKSTDate(date);
  const formatNumber = num => num.toLocaleString('ko-KR');
  return /*#__PURE__*/React.createElement(PostList, {
    formatDate: formatDate,
    formatNumber: formatNumber,
    onPostClick: onPostClick,
    showThumbnail: true,
    maxTags: 5,
    className: "mb-8",
    posts: posts,
    searchKeyword: searchKeyword,
    searchTechTags: searchTechTags,
    searchCompanyTags: searchCompanyTags
  });
}
;