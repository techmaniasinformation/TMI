import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
// 클라이언트 페이지네이션 컴포넌트
function ClientPagination({
  data,
  currentPage,
  pageSize = 10,
  onPageChange,
  renderItem,
  className = "",
  updateUrl = true
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 현재 페이지의 데이터 계산
  const {
    currentPageData,
    totalPages,
    totalCount
  } = useMemo(() => {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = data.slice(startIndex, endIndex);
    return {
      currentPageData,
      totalPages,
      totalCount
    };
  }, [data, currentPage, pageSize]);

  // 페이지 번호들을 계산하는 함수
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 0) {
      return pages;
    }
    if (totalPages <= 5) {
      // 5페이지 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 5페이지 초과면 현재 페이지 ±2 기준으로 표시
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // 현재 페이지 ±2 범위만 추가
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };
  const pageNumbers = getPageNumbers();

  // 데이터가 없으면 빈 상태 표시
  if (totalCount === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: `text-center py-8 text-gray-500 ${className}`
    }, "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }

  // 데이터가 있지만 한 페이지에 모두 들어가는 경우에도 페이지 1 표시
  if (totalPages === 1) {
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, currentPageData.map((item, index) => renderItem(item, index))), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center items-center space-x-2 mt-8"
    }, /*#__PURE__*/React.createElement("button", {
      className: "px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md",
      "aria-current": "page"
    }, "1")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, currentPageData.map((item, index) => renderItem(item, index))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center items-center space-x-2 mt-8"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.preventDefault();
      onPageChange(currentPage - 1);
    },
    disabled: currentPage === 1,
    className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
    "aria-label": "\uC774\uC804 \uD398\uC774\uC9C0"
  }, "\uC774\uC804"), pageNumbers.map((page, index) => /*#__PURE__*/React.createElement("button", {
    key: index,
    onClick: e => {
      e.preventDefault();
      if (typeof page === 'number') {
        onPageChange(page);
      }
    },
    disabled: typeof page === 'string',
    className: `px-3 py-2 text-sm font-medium rounded-md transition-colors ${typeof page === 'number' && currentPage === page ? 'bg-blue-600 text-white' : typeof page === 'string' ? 'text-gray-400 bg-white border border-gray-300 cursor-default' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`,
    "aria-label": typeof page === 'number' ? `페이지 ${page}로 이동` : undefined,
    "aria-current": typeof page === 'number' && currentPage === page ? 'page' : undefined
  }, page)), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.preventDefault();
      onPageChange(currentPage + 1);
    },
    disabled: currentPage === totalPages,
    className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
    "aria-label": "\uB2E4\uC74C \uD398\uC774\uC9C0"
  }, "\uB2E4\uC74C")), /*#__PURE__*/React.createElement("div", {
    className: "text-center text-sm text-gray-500 mt-4"
  }, "\uCD1D ", totalCount, "\uAC1C \uC911 ", (currentPage - 1) * pageSize + 1, " - ", Math.min(currentPage * pageSize, totalCount), "\uAC1C \uD45C\uC2DC"));
}
export default ClientPagination;