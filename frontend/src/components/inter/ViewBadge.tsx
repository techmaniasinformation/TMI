import React from 'react';

interface ViewBadgeProps {
  count?: number;
}

export default function ViewBadge({ count = 0 }: ViewBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs">
      <i className="fas fa-eye mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 