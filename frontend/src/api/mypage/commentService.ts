// api/mypage/commentService.ts
import type { CommentResponse } from "@/types/mypage/comment";

// 작성한 댓글 조회 API
export async function fetchMemberComments(
  memberId: number,
  page: number,
  size: number
): Promise<CommentResponse["data"]> {
  const res = await fetch(
    `https://i13a509.p.ssafy.io/api/v1/comment?memberId=${memberId}&page=${page}&size=${size}`
  );

  if (!res.ok) {
    throw new Error("작성한 댓글 조회 실패");
  }

  const data: CommentResponse = await res.json();

  if (data.status !== "SUCCESS") {
    throw new Error("API 응답 상태 실패");
  }

  return data.data;
}
