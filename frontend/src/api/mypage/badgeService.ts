import type { BadgeListResponse, MemberBadgeResponse, MemberBadge } from "@/types/mypage/badge";
const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

export async function fetchAllBadges() {
  const res = await fetch(`${BASE_URL}/badge`);
  if (!res.ok) throw new Error("전체 배지 조회 실패");
  const data: BadgeListResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");
  return data.data.badges; // [{ badgeId, name, description, badgeUrl }]
}

export async function fetchMemberBadges(memberId: number): Promise<MemberBadge[]> {
  const res = await fetch(`${BASE_URL}/memberBadge?memberId=${memberId}`);
  if (!res.ok) throw new Error("멤버 배지 조회 실패");
  const data: MemberBadgeResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");
  return data.data.memberBadges;
}