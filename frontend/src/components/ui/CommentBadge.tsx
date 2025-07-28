import React from 'react';
import comment from '../../assets/icons/comment.svg';

export default function CommentBadge() {
  return (
    <div className="inline-flex items-center gap-1">
      <img src={comment} alt="댓글 아이콘" className="w-5 h-5" />
      {/* 게시글 정보를 가져와서 숫자 수정 */}
      <span>32</span>
    </div>
  );
}
