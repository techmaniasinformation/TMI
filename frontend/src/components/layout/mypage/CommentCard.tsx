import React from "react";

// 댓글 카드 컴포넌트의 props 타입 정의
export interface CommentCardProps {
  postTitle: string;
  comment: string;
  date: string;
  onClick?: () => void;
}

// 날짜 포맷 함수
const formatDate = (raw: string) => {
  const date = new Date(raw);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 댓글 카드 UI 컴포넌트
const CommentCard: React.FC<CommentCardProps> = ({
  postTitle,
  comment,
  date,
  onClick
}) => {
  return (
    <div
      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <h3 className="font-medium text-gray-900 mb-2">{postTitle}</h3>
      <p className="text-gray-600 text-sm">{comment}</p>
      <div className="mt-2 text-xs text-gray-400">{formatDate(date)}</div>
    </div>
  );
};

export default CommentCard;