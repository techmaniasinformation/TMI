import React from 'react';
import comment from '@/assets/icons/comment.svg';

// props 타입 지정
interface CommentBadgeProps {
  count?: number;
}

export default function CommentBadge({ count = 0 }: CommentBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 whitespace-nowrap">
      <img src={comment} alt="댓글 아이콘" className="w-5 h-5" />
      <span>{count}</span>
    </div>
  );
}
