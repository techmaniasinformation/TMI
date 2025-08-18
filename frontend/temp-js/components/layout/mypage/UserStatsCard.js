import React from 'react';

// 숫자를 k, M 단위로 축약해서 보여주는 함수
function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

// 컴포넌트에 전달되는 props 정의

// 사용자 통계 카드 컴포넌트
export default function UserStatsCard({
  posts,
  comments,
  followers,
  views,
  isCompany = false // 기본값 false 설정
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-8 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-gray-900 dark:text-white"
  }, formatNumber(posts)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 dark:text-gray-300"
  }, "\uAC8C\uC2DC\uAE00 \uC218")), !isCompany && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-gray-900 dark:text-white"
  }, formatNumber(comments || 0)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 dark:text-gray-300"
  }, "\uB313\uAE00 \uC218")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-gray-900 dark:text-white"
  }, formatNumber(followers)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 dark:text-gray-300"
  }, "\uD314\uB85C\uC6CC \uC218")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-gray-900 dark:text-white"
  }, formatNumber(views)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 dark:text-gray-300"
  }, "\uB204\uC801 \uC870\uD68C \uC218")));
}