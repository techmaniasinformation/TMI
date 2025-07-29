import React from 'react';

interface StarBadgeProps {
  count?: number;
}

export default function StarBadge({ count = 0 }: StarBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs">
      <i className="fas fa-star mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 