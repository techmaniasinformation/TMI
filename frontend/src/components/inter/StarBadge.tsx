import React from 'react';
import Star from '@/assets/icons/star.svg';

interface StarBadgeProps {
  count?: number;
}

export default function StarBadge({ count = 0 }: StarBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs text-gray-600">
      <img src={Star} alt="star" className="w-4 h-4 mr-1" />
      {count.toLocaleString()}
    </span>
  );
}
