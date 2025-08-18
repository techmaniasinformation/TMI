import React from 'react';
import CommentIcon from '@/assets/icons/comment.svg';
export default function CommentBadge({
  count = 0
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center text-xs dark:text-gray-300"
  }, /*#__PURE__*/React.createElement("img", {
    src: CommentIcon,
    alt: "comment",
    className: "w-4 h-4 mr-1"
  }), count.toLocaleString());
}