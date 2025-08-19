import { getRequest, patchRequest } from './badgeApiClient';
import { handleBadgeError } from './badgeErrorHandler';
import type { BadgeListResponse, MemberBadgeResponse, MemberBadge } from "@/types/mypage/badge";

export type PatchRepBadgeResponse = {
  status: "SUCCESS" | "FAIL";
  data: { memberBadgeId: number };
};

// 전체 배지 메타 조회
export async function fetchAllBadges() {
  try {
    const data: BadgeListResponse = await getRequest<BadgeListResponse>('/badge');
    
    if (data.status !== "SUCCESS") {
      throw new Error("API 상태 실패");
    }
    
    return data.data.badges; // [{ badgeId, name, description, badgeUrl }]
  } catch (error) {
    throw handleBadgeError(error, '전체 배지 조회 실패');
  }
}

// 특정 멤버의 보유 배지 조회
export async function fetchMemberBadges(memberId: number): Promise<MemberBadge[]> {
  try {
    const data: MemberBadgeResponse = await getRequest<MemberBadgeResponse>(`/memberBadge?memberId=${memberId}`);
    
    if (data.status !== "SUCCESS") {
      throw new Error("API 상태 실패");
    }
    
    return data.data.memberBadges;
  } catch (error) {
    throw handleBadgeError(error, '멤버 배지 조회 실패');
  }
}

// 대표 배지 설정
export async function patchRepresentativeBadge(memberBadgeId: number): Promise<PatchRepBadgeResponse> {
  try {
    const data: PatchRepBadgeResponse = await patchRequest<PatchRepBadgeResponse>(`/memberBadge/${memberBadgeId}`);
    
    if (data.status !== "SUCCESS") {
      throw new Error("대표 배지 설정 실패");
    }
    
    return data;
  } catch (error) {
    throw handleBadgeError(error, '대표 배지 설정 실패');
  }
}

// 기본 배지(22)의 memberBadgeId 찾기 유틸
export const DEFAULT_BADGE_ID = 22;
export function pickDefaultMemberBadgeId(list: MemberBadge[]): number | undefined {
  return list.find(b => b.badgeId === DEFAULT_BADGE_ID)?.memberBadgeId;
}

