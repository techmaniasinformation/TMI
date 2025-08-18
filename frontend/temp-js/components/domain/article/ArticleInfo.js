import React from 'react';
import UserInfo from './UserInfo';
import DateTimeComponent from './DateTimeComponent';
import CardInfoCount from './CardInfoCount';
import TagArea from './TagArea';

// 게시글 데이터 타입

// 검색 하이라이트 타입

// 포맷팅 함수 타입

// 표시 옵션 타입

export default function ArticleInfo({
  id,
  title,
  author,
  authorProfile,
  authorBadge,
  tags,
  date,
  views,
  stars,
  comments,
  formatDate,
  formatNumber,
  maxTags = 5,
  keyword = '',
  techTags = [],
  companyTags = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(UserInfo, {
    profileImageUrl: authorProfile,
    nickname: author
  }, authorBadge && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-blue-600 dark:text-blue-400 font-medium"
  }, authorBadge)), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words break-all"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement(DateTimeComponent, {
    date: date,
    formatDate: formatDate
  }), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement(CardInfoCount, {
    viewCount: views,
    starCount: stars,
    commentCount: comments
  })), /*#__PURE__*/React.createElement(TagArea, {
    tags: tags,
    maxTags: maxTags,
    searchKeyword: keyword,
    searchTechTags: techTags,
    searchCompanyTags: companyTags
  }));
}