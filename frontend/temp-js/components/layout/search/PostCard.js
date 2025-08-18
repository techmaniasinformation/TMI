import React from 'react';
import { getSafeProfileUrl, handleProfileImageError } from "@/utils/defaultImages";
const PostCard = ({
  post,
  highlightedTags,
  formatDate,
  formatNumber
}) => {
  const isHighlightedTag = tag => {
    return highlightedTags.includes(tag);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: getSafeProfileUrl(post.author.avatar),
    alt: post.author.name,
    className: "w-12 h-12 rounded-full object-cover",
    onError: handleProfileImageError
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 mb-1 break-words break-all"
  }, post.title), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-sm text-gray-600 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, post.author.name), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, post.author.company), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, formatDate(post.createdAt))))), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 mb-3 line-clamp-2 break-words break-all"
  }, post.content), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-3"
  }, post.tags.map((tag, index) => /*#__PURE__*/React.createElement("span", {
    key: index,
    className: `px-2 py-1 rounded-full text-xs font-medium ${isHighlightedTag(tag) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`
  }, tag))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4 text-sm text-gray-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye mr-1"
  }), formatNumber(post.views)), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-heart mr-1"
  }), formatNumber(post.likes))))));
};
export default PostCard;