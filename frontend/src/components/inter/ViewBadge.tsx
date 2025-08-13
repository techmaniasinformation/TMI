import React from 'react';
import ViewIcon from '@/assets/icons/view.svg';

interface ViewBadgeProps {
  count?: number;
}

export default function ViewBadge({ count = 0 }: ViewBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-300">
      <img src={ViewIcon} alt="views" className="w-4 h-4 mr-1" />
      {count.toLocaleString()}
    </span>
  );
}
