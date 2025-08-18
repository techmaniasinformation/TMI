import React from 'react';
const SearchConditions = ({
  searchConditions,
  onRemoveCondition
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold text-gray-900 mb-4"
  }, "\uAC80\uC0C9 \uC870\uAC74"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, searchConditions.keyword && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-search mr-2"
  }), /*#__PURE__*/React.createElement("span", null, searchConditions.keyword), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemoveCondition('keyword'),
    className: "ml-2 text-blue-600 hover:text-blue-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  }))), searchConditions.tags.map((tag, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-tag mr-2"
  }), /*#__PURE__*/React.createElement("span", null, tag), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemoveCondition('tag', tag),
    className: "ml-2 text-green-600 hover:text-green-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })))), searchConditions.company && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-building mr-2"
  }), /*#__PURE__*/React.createElement("span", null, searchConditions.company), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemoveCondition('company'),
    className: "ml-2 text-purple-600 hover:text-purple-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })))));
};
export default SearchConditions;