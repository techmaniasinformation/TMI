import React from "react";

// 댓글 카드 컴포넌트의 props 타입 정의

// 날짜 포맷 함수 (UTC -> KST 변환)
const formatDate = raw => {
  // UTC 시간을 한국 시간으로 변환
  const utcDate = new Date(raw);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 (한국 시간)

  return kstDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  });
};

// 댓글 카드 UI 컴포넌트
const CommentCard = ({
  postTitle,
  comment,
  date,
  onClick
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-medium text-gray-900 dark:text-white mb-2"
  }, postTitle), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-300 text-sm break-all break-words"
  }, comment), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-xs text-gray-400 dark:text-gray-500"
  }, formatDate(date)));
};
export default CommentCard;