import React, { useState } from 'react';
import { getSafeProfileUrl, getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';
export const PostItem = ({
  post,
  formatDate,
  formatNumber,
  maxTags = 5,
  showThumbnail = true,
  onClick,
  className = ''
}) => {
  // 이미지 에러 상태 관리
  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailImageError, setThumbnailImageError] = useState(false);
  const handleClick = () => {
    if (onClick) {
      onClick(post.postId);
    }
  };

  // 안전한 이미지 URL 사용
  const safeProfileUrl = getSafeProfileUrl(post.memberProfileUrl);
  const safeThumbnailUrl = getSafeThumbnailUrl(post.thumbnailUrl);
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full flex-shrink-0 overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: profileImageError ? DEFAULT_IMAGES.PROFILE : safeProfileUrl,
    alt: post.name,
    className: "w-full h-full object-cover",
    onError: () => setProfileImageError(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words break-all"
  }, post.title), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium text-gray-700"
  }, post.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-500"
  }, formatDate(post.createAt))), post.tags && post.tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3 flex-wrap"
  }, post.tags.slice(0, maxTags).map((tag, index) => /*#__PURE__*/React.createElement("span", {
    key: index,
    className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
  }, tag))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-sm text-gray-500"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC41\uFE0F ", formatNumber(post.viewCount)), /*#__PURE__*/React.createElement("span", null, "\u2B50 ", formatNumber(post.starCount)), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC ", formatNumber(post.commentCount || 0)))), showThumbnail && /*#__PURE__*/React.createElement("div", {
    className: "w-48 h-32 flex-shrink-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: thumbnailImageError ? DEFAULT_IMAGES.THUMBNAIL : safeThumbnailUrl,
    alt: post.title,
    className: "w-full h-full object-cover rounded-lg",
    onError: () => setThumbnailImageError(true)
  }))));
};