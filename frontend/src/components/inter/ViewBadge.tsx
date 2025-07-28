import React from 'react';

interface ViewBadgeProps {
  count?: number;
}

export default function ViewBadge({ count = 0 }: ViewBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      <i className="fas fa-eye mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 