import React from 'react';
export const ErrorState = ({
  title = "오류가 발생했습니다",
  message,
  icon = "fas fa-exclamation-triangle",
  actions,
  className = ""
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-4xl mx-auto ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("i", {
    className: `${icon} text-6xl text-red-300 mb-4`
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-red-600 mb-2"
  }, title), message && /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4 max-w-md mx-auto"
  }, message)), actions && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, actions)));
};

// 기본 에러 액션 버튼들
export const DefaultErrorActions = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
  onClick: () => window.location.reload(),
  className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-redo mr-2"
}), "\uB2E4\uC2DC \uC2DC\uB3C4"), /*#__PURE__*/React.createElement("button", {
  onClick: () => window.history.back(),
  className: "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-arrow-left mr-2"
}), "\uC774\uC804 \uD398\uC774\uC9C0\uB85C"));