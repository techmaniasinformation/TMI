import React, { useState, useCallback } from 'react';
import ArticleInfo from './ArticleInfo';
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';
export default function PostList({
  formatDate,
  formatNumber,
  onPostClick,
  className = '',
  showThumbnail = true,
  maxTags = 5,
  posts,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}) {
  // 이미지 에러 상태를 객체로 관리 (postId를 키로 사용)
  const [imageErrors, setImageErrors] = useState({});

  // 이미지 에러 핸들러
  const handleImageError = useCallback(postId => {
    setImageErrors(prev => ({
      ...prev,
      [postId]: true
    }));
  }, []);

  // 빈 결과 상태
  if (posts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: `text-center py-12 ${className}`
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-inbox text-6xl text-gray-300 mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-lg text-gray-500"
    }, "\uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `space-y-6 ${className}`
  }, posts.map(post => {
    const hasImageError = imageErrors[post.postId] || false;
    return /*#__PURE__*/React.createElement("div", {
      key: post.postId,
      className: "group bg-light-header dark:bg-dark-header rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-4",
      onClick: () => onPostClick?.(post.postId)
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-4"
    }, /*#__PURE__*/React.createElement(ArticleInfo, {
      id: post.postId,
      title: post.title,
      author: post.name,
      authorProfile: post.memberProfileUrl,
      authorBadge: post.badgeUrl,
      tags: post.tags,
      date: post.createAt,
      views: post.viewCount,
      stars: post.starCount,
      comments: post.commentCount,
      formatDate: formatDate,
      formatNumber: formatNumber,
      maxTags: maxTags,
      keyword: searchKeyword,
      techTags: searchTechTags,
      companyTags: searchCompanyTags
    }), showThumbnail && /*#__PURE__*/React.createElement("div", {
      className: "w-48 h-32 flex-shrink-0"
    }, /*#__PURE__*/React.createElement("img", {
      src: hasImageError ? DEFAULT_IMAGES.THUMBNAIL : getSafeThumbnailUrl(post.thumbnailUrl),
      alt: post.title,
      className: "w-full h-full object-cover rounded-r-lg",
      onError: () => handleImageError(post.postId)
    }))));
  }));
}