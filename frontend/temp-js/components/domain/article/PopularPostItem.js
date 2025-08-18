import React from 'react';
import StarIcon from '@/assets/icons/star.svg';
import ViewIcon from '@/assets/icons/view.svg';
export const PopularPostItem = ({
  post,
  index,
  formatNumber,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(post.postId);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`,
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-semibold"
  }, index + 1), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 hover:text-blue-600 dark:hover:text-blue-400"
  }, post.title), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, post.name), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: StarIcon,
    alt: "star",
    className: "w-3 h-3 mr-1"
  }), formatNumber(post.starCount)), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: ViewIcon,
    alt: "view",
    className: "w-3 h-3 mr-1"
  }), formatNumber(post.viewCount))))));
};