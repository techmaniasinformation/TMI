import type { CommentResponse } from "@/types/mypage/comment";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export const fetchMemberComments = async (
  memberId: number,
  page: number,
  size: number
): Promise<CommentResponse> => {
  const res = await fetch(
    `${BASE_URL}/comment?memberId=${memberId}&page=${page}&size=${size}`
  );

  if (!res.ok) {
    throw new Error(`댓글 불러오기 실패 (status: ${res.status})`);
  }

  return res.json();
};
