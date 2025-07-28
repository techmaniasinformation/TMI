import React from 'react';
import star from '@/assets/icons/star.svg';

// props 타입 지정
interface StarBadgeProps {
  count: number;
}

export default function StarBadge({ count = 0 }: StarBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 whitespace-nowrap">
      <img src={star} alt="별 아이콘" className="w-5 h-5" />
      <span>{count}</span>
    </div>
  );
}