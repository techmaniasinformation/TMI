interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const visiblePages = 5;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const half = Math.floor(visiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = start + visiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center mt-6 space-x-1">
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(1)}
        disabled={isFirst}
      >
        «
      </button>
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
      >
        ‹
      </button>

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

      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
      >
        ›
      </button>
      <button
        className="w-9 h-9 border rounded text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
