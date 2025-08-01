import React from 'react';
import { Button } from '@/components/foundation/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 페이지 번호들 생성
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
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

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        className="!rounded-button cursor-pointer whitespace-nowrap"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left mr-2"></i>
        이전
      </Button>
      
      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? 'default' : 'outline'}
          className="!rounded-button cursor-pointer whitespace-nowrap w-10 h-10"
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}
      
      <Button
        variant="outline"
        className="!rounded-button cursor-pointer whitespace-nowrap"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
        <i className="fas fa-chevron-right ml-2"></i>
      </Button>
    </div>
  );
} 