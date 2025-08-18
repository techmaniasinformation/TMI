import React from 'react';
import Star from '@/assets/icons/star.svg';
export default function StarBadge({
  count = 0
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center text-xs text-gray-600 dark:text-gray-300"
  }, /*#__PURE__*/React.createElement("img", {
    src: Star,
    alt: "star",
    className: "w-4 h-4 mr-1"
  }), count.toLocaleString());
}