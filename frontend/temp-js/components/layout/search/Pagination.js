import React from 'react';
import { Button } from '@/components/foundation/button';
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  // 페이지 번호들 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "!rounded-button cursor-pointer whitespace-nowrap",
    onClick: () => onPageChange(Math.max(1, currentPage - 1)),
    disabled: currentPage === 1
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chevron-left mr-2"
  }), "\uC774\uC804"), getPageNumbers().map(pageNum => /*#__PURE__*/React.createElement(Button, {
    key: pageNum,
    variant: currentPage === pageNum ? 'default' : 'outline',
    className: "!rounded-button cursor-pointer whitespace-nowrap w-10 h-10",
    onClick: () => onPageChange(pageNum)
  }, pageNum)), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "!rounded-button cursor-pointer whitespace-nowrap",
    onClick: () => onPageChange(Math.min(totalPages, currentPage + 1)),
    disabled: currentPage === totalPages
  }, "\uB2E4\uC74C", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chevron-right ml-2"
  })));
}