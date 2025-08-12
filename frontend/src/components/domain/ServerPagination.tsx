import { useSearchParams } from 'react-router-dom';

interface ServerPaginationProps {
  currentPage: number;  // 현재 페이지 번호
  totalCount: number;   // 전체 데이터 개수
  pageSize?: number;    // 페이지당 데이터 개수 (기본값: 10)
  onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
  updateUrl?: boolean;  // URL 업데이트 여부 (기본값: true)
}

// 서버 페이지네이션 버튼 만들어주는 함수
function ServerPagination({ 
  currentPage, 
  totalCount, 
  pageSize = 10, 
  onPageChange,
  updateUrl = true
}: ServerPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);

  // 페이지가 0개 이하면 페이지네이션 숨김
  if (totalPages <= 0) {

    return null;
  }

  // 데이터가 있지만 한 페이지에 모두 들어가는 경우에도 페이지 1 표시
  if (totalPages === 1) {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md"
          aria-current="page"
        >
          1
        </button>
      </div>
    );
  }

  // 페이지 번호들을 계산하는 함수
  const getPageNumbers = () => {
    const pages: number[] = [];
    
    if (totalPages <= 5) {
      // 5페이지 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 5페이지 초과면 현재 페이지 중심으로 5개 표시
      let startPage = currentPage - 2;
      let endPage = currentPage + 2;
      
      // 시작 페이지가 1보다 작으면 조정
      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(5, totalPages);
      }
      
      // 끝 페이지가 totalPages보다 크면 조정
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - 4);
      }
      
      // 페이지 번호들 추가
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
        onClick={(e) => {
          e.preventDefault();
          if (updateUrl) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', (currentPage - 1).toString());
            setSearchParams(newSearchParams);
          }
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="이전 페이지"
      >
        이전
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={(e) => {
            e.preventDefault();
            if (updateUrl) {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set('page', page.toString());
              setSearchParams(newSearchParams);
            }
            onPageChange(page);
          }}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
          aria-label={`페이지 ${page}로 이동`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={(e) => {
          e.preventDefault();
          if (updateUrl) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', (currentPage + 1).toString());
            setSearchParams(newSearchParams);
          }
          onPageChange(currentPage + 1);
        }}
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
