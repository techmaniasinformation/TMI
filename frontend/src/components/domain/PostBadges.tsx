import React from 'react';
import StarBadge from '@/components/inter/StarBadge';
import CommentBadge from '@/components/inter/CommentBadge';
import ViewBadge from '@/components/inter/ViewBadge';

// starCount, commentCount, viewCount를 부모 컴포넌트로부터 받을 수 있음
// showStar, showComment, showView : 각 배지를 표시할 지 말지 결정하는 옵션
interface PostBadgesProps {
  starCount?: number;
  commentCount?: number;
  viewCount?: number;
  showStar?: boolean;
  showComment?: boolean;
  showView?: boolean;
}

// 각 값에 기본값을 할당
export default function PostBadges({
  starCount = 0,
  commentCount = 0,
  viewCount = 0,
  showStar = true,
  showComment = true,
  showView = true,
}: PostBadgesProps) {
  return (
    // 왼쪽 정렬
    // show가 true일 때만 Count 표시
    // 조회수, 별, 댓글 순으로 보임
    <div className="flex justify-start gap-4">
      {showView && <ViewBadge count={viewCount} />}
      {showStar && <StarBadge count={starCount} />}
      {showComment && <CommentBadge count={commentCount} />}
    </div>
  );
}
