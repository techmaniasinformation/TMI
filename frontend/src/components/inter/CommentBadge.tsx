import React from 'react';

interface CommentBadgeProps {
  count?: number;
}

export default function CommentBadge({ count = 0 }: CommentBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs dark:text-gray-300">
      <i className="fas fa-comment mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 