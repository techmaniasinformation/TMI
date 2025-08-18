import React from 'react';
import { Input, Button, Tag } from '@/components';
const SearchFilter = ({
  keyword,
  selectedTags,
  availableTags,
  onKeywordChange,
  onTagToggle,
  onClearFilters
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-2"
  }, "\uAC80\uC0C9\uC5B4"), /*#__PURE__*/React.createElement(Input, {
    type: "text",
    placeholder: "\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694...",
    value: keyword,
    onChange: e => onKeywordChange(e.target.value),
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-2"
  }, "\uD0DC\uADF8 \uD544\uD130"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, availableTags.map(tag => /*#__PURE__*/React.createElement(Tag, {
    key: tag,
    tag: tag,
    variant: selectedTags.includes(tag) ? 'default' : 'default',
    className: `cursor-pointer ${selectedTags.includes(tag) ? 'bg-blue-100 border-blue-300' : ''}`,
    onClick: () => onTagToggle(tag)
  })))), (keyword || selectedTags.length > 0) && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onClearFilters,
    variant: "outline",
    size: "sm"
  }, "\uD544\uD130 \uCD08\uAE30\uD654"))));
};
export default SearchFilter;