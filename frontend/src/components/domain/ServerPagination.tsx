interface ServerPaginationProps {
  currentPage: number;  // 현재 페이지 번호
  totalPages: number;   // 전체 페이지 수
  onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
}

// 페이지 버튼 만들어주는 함수
function ServerPagination({ currentPage, totalPages, onPageChange }: ServerPaginationProps) {
  // 최대 보여줄 페이지 개수
  const visiblePages = 5;

  // 페이지 번호 목록 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    const half = Math.floor(visiblePages / 2); // 현재 페이지를 중심으로 반쪽

    // 시작 페이지 계산 (최소 1이상)
    let start = Math.max(1, currentPage - half);

    // 끝 페이지 계산
    let end = start + visiblePages - 1;

    // 끝 페이지가 전체 페이지를 넘으면 마지막 번호를 전체 페이지로
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePages + 1);
    }

    // start ~ end 까지 페이지 번호 배열 생성
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 첫 페이지인지 확인
  const isFirst = currentPage === 1;
  // 마지막 페이지인지 확인
  const isLast = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center mt-6 space-x-1">
      {/* 맨 앞으로 이동 버튼 («) */}
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(1)}
        disabled={isFirst}
      >
        «
      </button>

      {/* 이전 페이지 이동 버튼 (‹) */}
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
      >
        ‹
      </button>

      {/* 페이지 번호 버튼들 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 border rounded text-sm font-medium ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 이동 버튼 (›) */}
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
      >
        ›
      </button>

      {/* 맨 끝으로 이동 버튼 (») */}
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
      >
        »
      </button>
    </div>
  );
}

export default ServerPagination; 