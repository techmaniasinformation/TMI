// types/mypage/comment.ts

export interface Comment {
  commentId: number;
  postId: number;
  memberId: number;            // 댓글 작성자 ID (삭제 버튼 표시용)
  title: string;               // 게시글 제목
  memberProfileUrl: string;    // 댓글 작성자 프로필 URL
  name: string;                // 댓글 작성자 닉네임
  badgeUrl: string | null;     // 배지 이미지 URL (없으면 null)
  comment: string;             // 댓글 내용
  link: string | null;         // 댓글에 포함된 링크 (없으면 null)
  createAt: string;            // 작성일
  recommendCount: number;      // 추천 수
}

export interface CommentPageInfo {
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  currPage: number;
}

export interface CommentResponse {
  status: string;
  data: {
    comments: Comment[];
    pageInfo: CommentPageInfo;
  };
}
