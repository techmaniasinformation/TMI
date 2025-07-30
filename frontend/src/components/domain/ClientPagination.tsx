import React from 'react';

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}: ClientPaginationProps) {
  // 페이지가 1개 이하면 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // 전체 페이지 수에 따라 표시할 페이지 결정
    if (totalPages <= 10) {
      // 10개 이하면 1만 표시
      pages.push(1);
    } else if (totalPages <= 20) {
      // 10개 이상 20개 이하면 1, 2 표시
      pages.push(1, 2);
    } else {
      // 20개 이상이면 최대 5개 표시 (현재 페이지 중심)
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // 끝 페이지가 totalPages에 가까우면 시작 페이지 조정
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
        aria-label="이전 페이지로 이동"
      >
        <i className="fas fa-chevron-left mr-1"></i>
        이전
      </button>

      {/* 페이지 번호들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
          aria-label={`${page}페이지로 이동`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
        aria-label="다음 페이지로 이동"
      >
        다음
        <i className="fas fa-chevron-right ml-1"></i>
      </button>

      {/* 페이지 정보 표시 (선택사항) */}
      {itemsPerPage && totalItems && (
        <div className="ml-4 text-sm text-gray-500">
          {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} / ${totalItems}`}
        </div>
      )}
    </div>
  );
} 