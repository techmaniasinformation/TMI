import React, { useState, useMemo } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';
export const PostContent = ({
  post,
  onStarClick,
  onShareClick,
  isStarLoading = false,
  showStarButton = true
}) => {
  // 이미지 로드 실패 상태 관리
  const [imageError, setImageError] = useState(false);

  // 안전한 썸네일 이미지 URL을 메모이제이션
  const safeThumbnailUrl = useMemo(() => {
    return getSafeThumbnailUrl(post.thumbnailUrl);
  }, [post.thumbnailUrl]);

  // 이미지 로드 실패 시 디폴트 이미지로 대체
  const handleImageError = () => {
    setImageError(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-16 pt-12 pb-12 flex justify-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: imageError ? DEFAULT_IMAGES.THUMBNAIL : safeThumbnailUrl,
    alt: "\uAC8C\uC2DC\uAE00 \uC378\uB124\uC77C",
    className: "max-w-4xl h-96 object-contain rounded-lg",
    onError: handleImageError
  })), /*#__PURE__*/React.createElement("div", {
    className: "prose max-w-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-700 dark:text-gray-200 leading-relaxed text-lg px-16 pb-12 break-words break-all",
    dangerouslySetInnerHTML: {
      __html: post.content
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-6 border-t border-gray-200 dark:border-gray-700"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center space-x-4 px-6 pb-6"
  }, post.link && /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "sm",
    className: "bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2",
    onClick: () => window.open(post.link, '_blank')
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
  })), /*#__PURE__*/React.createElement("span", null, "\uC6D0\uBB38 \uAC00\uAE30")), /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    size: "sm",
    className: "bg-light-header dark:bg-dark-header text-black dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800",
    onClick: onShareClick
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
  })), /*#__PURE__*/React.createElement("span", null, "\uB9C1\uD06C \uBCF5\uC0AC")), showStarButton && /*#__PURE__*/React.createElement("button", {
    onClick: onStarClick,
    disabled: isStarLoading,
    className: `flex items-center justify-center w-10 h-10 text-yellow-500 hover:text-yellow-600 transition-colors ${isStarLoading ? 'opacity-50 cursor-not-allowed' : ''}`
  }, isStarLoading ? /*#__PURE__*/React.createElement("div", {
    className: "w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"
  }) : /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: post.isStar ? "currentColor" : "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  })))));
};