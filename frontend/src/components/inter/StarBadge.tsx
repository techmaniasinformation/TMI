import React from 'react';

interface StarBadgeProps {
  count?: number;
}

export default function StarBadge({ count = 0 }: StarBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <i className="fas fa-star mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 