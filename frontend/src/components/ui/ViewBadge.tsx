import React from 'react';
import view from '../../assets/icons/view.svg';

export default function ViewBadge() {
  return (
    <div className="inline-flex items-center gap-1">
      <img src={view} alt="조회수 아이콘" className="w-5 h-5" />
      {/* 게시글 정보를 가져와서 숫자 수정 */}
      <span>1024</span>
    </div>
  );
}
