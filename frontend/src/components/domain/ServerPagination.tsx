interface ServerPaginationProps {
  currentPage: number;  // 현재 페이지 번호
  totalCount: number;   // 전체 데이터 개수
  pageSize?: number;    // 페이지당 데이터 개수 (기본값: 10)
  onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
}

// 서버 페이지네이션 버튼 만들어주는 함수
function ServerPagination({ 
  currentPage, 
  totalCount, 
  pageSize = 10, 
  onPageChange 
}: ServerPaginationProps) {
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);

  // 디버깅을 위한 콘솔 로그
  console.log('📄 ServerPagination Debug:', {
    currentPage,
    totalCount,
    pageSize,
    totalPages,
    shouldShow: totalPages > 0
  });

  // 페이지가 0개 이하면 페이지네이션 숨김
  if (totalPages <= 0) {
    console.log('❌ ServerPagination hidden: totalPages <= 0');
    return null;
  }

  // 페이지 번호들을 계산하는 함수
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // 항상 최소 1페이지는 표시
    if (totalPages === 1) {
      pages.push(1);
    } else if (totalPages <= 5) {
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

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="다음 페이지"
      >
        다음
      </button>
    </div>
  );
}

export default ServerPagination;
