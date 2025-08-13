// 통합: 전체 배지 조회, 내 배지 조회, 대표 배지 설정 + 유틸

import type { BadgeListResponse, MemberBadgeResponse, MemberBadge } from "@/types/mypage/badge";

export type PatchRepBadgeResponse = {
  status: "SUCCESS" | "FAIL";
  data: { memberBadgeId: number };
};

const BASE_URL = "https://i13a509.p.ssafy.io/api/v1";

// 공통 응답 체크
async function assertOk(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ""}`);
  }
}

/** 전체 배지 메타 조회 */
export async function fetchAllBadges() {
  const res = await fetch(`${BASE_URL}/badge`);
  await assertOk(res);

  const data = (await res.json()) as BadgeListResponse;
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");
  return data.data.badges; // [{ badgeId, name, description, badgeUrl }]
}

/** 특정 멤버의 보유 배지 조회 */
export async function fetchMemberBadges(memberId: number): Promise<MemberBadge[]> {
  const res = await fetch(`${BASE_URL}/memberBadge?memberId=${memberId}`);
  await assertOk(res);

  const data = (await res.json()) as MemberBadgeResponse;
  if (data.status !== "SUCCESS") throw new Error("API 상태 실패");
  return data.data.memberBadges;
}

/** 대표 배지 설정 (Path 파라미터는 badgeId가 아니라 memberBadgeId 임) */
export async function patchRepresentativeBadge(memberBadgeId: number): Promise<PatchRepBadgeResponse> {
  const res = await fetch(`${BASE_URL}/memberBadge/${memberBadgeId}`, {
    method: "PATCH",
  });
  await assertOk(res);

  const data = (await res.json()) as PatchRepBadgeResponse;
  if (data.status !== "SUCCESS") throw new Error("대표 배지 설정 실패");
  return data;
}

/** 기본 배지(22)의 memberBadgeId 찾기 유틸 */
export const DEFAULT_BADGE_ID = 22;
export function pickDefaultMemberBadgeId(list: MemberBadge[]): number | undefined {
  return list.find(b => b.badgeId === DEFAULT_BADGE_ID)?.memberBadgeId;
}
