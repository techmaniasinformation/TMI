import React from 'react';
import view from '@/assets/icons/view.svg';

// props 타입 지정
interface ViewBadgeProps {
  count?: number;
}

export default function ViewBadge({ count = 0 }: ViewBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 whitespace-nowrap">
      <img src={view} alt="조회수 아이콘" className="w-5 h-5" />
      <span>{count}</span>
    </div>
  );
}
