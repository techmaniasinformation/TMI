import React from 'react';

interface CommentBadgeProps {
  count?: number;
}

export default function CommentBadge({ count = 0 }: CommentBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      <i className="fas fa-comment mr-1"></i>
      {count.toLocaleString()}
    </span>
  );
} 