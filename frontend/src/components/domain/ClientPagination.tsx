import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ClientPaginationProps<T> {
  data: T[];                    // 전체 데이터 배열
  currentPage: number;          // 현재 페이지 번호
  pageSize?: number;            // 페이지당 데이터 개수 (기본값: 10)
  onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
  renderItem: (item: T, index: number) => React.ReactNode; // 각 아이템을 렌더링하는 함수
  className?: string;           // 추가 스타일링을 위한 클래스명
  updateUrl?: boolean;          // URL 업데이트 여부 (기본값: true)
}

// 클라이언트 페이지네이션 컴포넌트
function ClientPagination<T>({ 
  data, 
  currentPage, 
  pageSize = 10, 
  onPageChange,
  renderItem,
  className = "",
  updateUrl = true
}: ClientPaginationProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 현재 페이지의 데이터 계산
  const { currentPageData, totalPages, totalCount } = useMemo(() => {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = data.slice(startIndex, endIndex);
    
    return { currentPageData, totalPages, totalCount };
  }, [data, currentPage, pageSize]);

  // 페이지 번호들을 계산하는 함수
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
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
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        데이터가 없습니다.
      </div>
    );
  }

  // 데이터가 있지만 한 페이지에 모두 들어가는 경우에도 페이지 1 표시
  if (totalPages === 1) {
    return (
      <div className={className}>
        {/* 데이터 렌더링 */}
        <div className="space-y-4">
          {currentPageData.map((item, index) => renderItem(item, index))}
        </div>

        {/* 페이지네이션 UI */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md"
            aria-current="page"
          >
            1
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 데이터 렌더링 */}
      <div className="space-y-4">
        {currentPageData.map((item, index) => renderItem(item, index))}
      </div>

      {/* 페이지네이션 UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="이전 페이지"
          >
            이전
          </button>

          {/* 페이지 번호 버튼들 */}
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                if (typeof page === 'number') {
                  onPageChange(page);
                }
              }}
              disabled={typeof page === 'string'}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                typeof page === 'number' && currentPage === page
                  ? 'bg-blue-600 text-white'
                  : typeof page === 'string'
                  ? 'text-gray-400 bg-white border border-gray-300 cursor-default'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={typeof page === 'number' ? `페이지 ${page}로 이동` : undefined}
              aria-current={typeof page === 'number' && currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          {/* 다음 페이지 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="다음 페이지"
          >
            다음
          </button>
        </div>
      )}

      {/* 페이지 정보 표시 */}
      <div className="text-center text-sm text-gray-500 mt-4">
        총 {totalCount}개 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}개 표시
      </div>
    </div>
  );
}

export default ClientPagination; 