import React from 'react';
import CommentIcon from '@/assets/icons/comment.svg';

interface CommentBadgeProps {
  count?: number;
}

export default function CommentBadge({ count = 0 }: CommentBadgeProps) {
  return (
    <span className="inline-flex items-center text-xs dark:text-gray-300">
      <img src={CommentIcon} alt="comment" className="w-4 h-4 mr-1" />
      {count.toLocaleString()}
    </span>
  );
} 