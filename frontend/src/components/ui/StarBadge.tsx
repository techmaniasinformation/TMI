import React from 'react';
import star from '../../assets/icons/star.svg';

export default function StarBadge() {
  return (
    <div className="inline-flex items-center gap-1">
      <img src={star} alt="별 아이콘" className="w-5 h-5" />
      {/* 게시글 정보를 가져와서 숫자 수정 */}
      <span>198</span>
    </div>
  );
}
