import React from 'react';
export default function DateTimeComponent({
  date,
  formatDate
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, formatDate(date));
}