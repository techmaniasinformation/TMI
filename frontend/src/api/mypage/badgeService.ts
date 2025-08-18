// 배지 서비스 통합 인터페이스
// 기존 API 호환성을 위해 모든 함수를 재export

// 배지 관련 서비스
export {
  fetchAllBadges,
  fetchMemberBadges,
  patchRepresentativeBadge,
  pickDefaultMemberBadgeId,
  DEFAULT_BADGE_ID
} from '../badge/badgeService';

// 타입 재export
export type {
  BadgeListResponse,
  MemberBadgeResponse,
  MemberBadge,
  PatchRepBadgeResponse
} from "@/types/mypage/badge";
