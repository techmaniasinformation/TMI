import type { StarredPostsResponse } from "@/types/mypage/star";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export const fetchStarredPosts = async (
  memberId: number,
  page: number,
  size: number
): Promise<StarredPostsResponse> => {
  const res = await fetch(
    `${BASE_URL}/post?starMemberId=${memberId}&page=${page}&size=${size}`,
    { method: "GET" }
  );

  if (!res.ok) {
    throw new Error(`스타 게시글 불러오기 실패 (status: ${res.status})`);
  }

  return res.json();
};
