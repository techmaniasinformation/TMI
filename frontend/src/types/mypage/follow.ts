export interface CompanyFollow {
  companyFollowId: number;
  companyId: number;
  name: string;
  companyProfileUrl: string | null;
}

export interface MemberFollow {
  memberFollowId: number;
  memberId: number;
  nickname: string;
  memberProfileUrl: string;
  badgeUrl: string | null;
}
