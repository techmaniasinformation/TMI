import type { BadgeListResponse, MemberBadge, MemberBadgeResponse } from "@/types/mypage/badge";

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

// 전체 배지 목록 조회는 그대로 사용
export async function fetchAllBadges() {
  const res = await fetch(`${BASE_URL}/badge`);
  if (!res.ok) throw new Error("전체 배지 조회 실패");

  const data: BadgeListResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");

  return data.data.badges;
}

// 멤버가 보유한 배지 전체 정보 반환 (badgeId + receivedAt)
export async function fetchMemberBadges(memberId: number): Promise<MemberBadge[]> {
  const res = await fetch(`${BASE_URL}/memberBadge?memberId=${memberId}`);
  if (!res.ok) throw new Error("멤버 배지 조회 실패");

  const data: MemberBadgeResponse = await res.json();
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");

  // 전체 memberBadge 객체 반환 (badgeId, memberBadgeId, receivedAt 포함)
  return data.data.memberBadges;
}
