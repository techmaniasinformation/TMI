import React from 'react';
export const EmptyState = ({
  title = "데이터가 없습니다",
  description,
  icon = "fas fa-search",
  iconColor = "text-gray-300",
  tips,
  className = ""
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `w-full max-w-4xl mx-auto ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("i", {
    className: `${icon} text-6xl ${iconColor} mb-4`
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-600 mb-2"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 max-w-md mx-auto"
  }, description)), tips && /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto"
  }, tips)));
};

// 검색 팁 컴포넌트
export const SearchTips = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
  className: "font-medium text-blue-800 mb-2"
}, "\uAC80\uC0C9 \uD301"), /*#__PURE__*/React.createElement("ul", {
  className: "text-sm text-blue-700 space-y-1 text-left"
}, /*#__PURE__*/React.createElement("li", null, "\u2022 \uAE30\uC220 \uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9 (\uC608: Python, React, Spring)"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uAE30\uC220 \uD0DC\uADF8 \uC120\uD0DD\uC73C\uB85C \uC815\uD655\uD55C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uD68C\uC0AC \uD0DC\uADF8\uB85C \uD2B9\uC815 \uD68C\uC0AC \uAC8C\uC2DC\uBB3C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uC5EC\uB7EC \uC870\uAC74\uC744 \uC870\uD569\uD558\uC5EC \uAC80\uC0C9")));

// 검색 결과 없음 팁 컴포넌트
export const NoResultsTips = ({
  keyword
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
  className: "font-medium text-yellow-800 mb-2"
}, "\uB2E4\uB978 \uBC29\uBC95\uC73C\uB85C \uAC80\uC0C9\uD574\uBCF4\uC138\uC694"), /*#__PURE__*/React.createElement("ul", {
  className: "text-sm text-yellow-700 space-y-1 text-left"
}, /*#__PURE__*/React.createElement("li", null, "\u2022 \uB2E4\uB978 \uD0A4\uC6CC\uB4DC\uB098 \uD0DC\uADF8\uB85C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uAC80\uC0C9\uC5B4\uC758 \uCCA0\uC790\uB97C \uD655\uC778\uD574\uBCF4\uC138\uC694"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uB354 \uC77C\uBC18\uC801\uC778 \uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("li", null, "\u2022 \uD0DC\uADF8\uB97C \uD558\uB098\uC529 \uC81C\uAC70\uD574\uBCF4\uC138\uC694")));