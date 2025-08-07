// 전체 배지 타입
export interface Badge {
  badgeId: number;
  name: string;
  description: string;
  badgeUrl: string;
}

// 전체 배지 API 응답 타입
export interface BadgeListResponse {
  status: string;
  data: {
    badges: Badge[];
  };
}

// 멤버 보유 배지 타입
export interface MemberBadge {
  memberBadgeId: number;
  badgeId: number;
  receivedAt: string;
}

// 멤버 배지 API 응답 타입
export interface MemberBadgeResponse {
  status: string;
  data: {
    memberBadges: MemberBadge[];
  };
}
