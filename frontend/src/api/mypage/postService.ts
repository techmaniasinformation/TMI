import type { MyPagePostResponse } from "@/types/mypage/post";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export const fetchMemberPosts = async (
  memberId: number,
  page: number,
  size: number
): Promise<MyPagePostResponse> => {
  const res = await fetch(
    `${BASE_URL}/post?memberId=${memberId}&page=${page}&size=${size}`
  );

  if (!res.ok) {
    throw new Error(`게시글 불러오기 실패 (status: ${res.status})`);
  }

  return res.json();
};
