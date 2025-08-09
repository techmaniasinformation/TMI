// /src/types/follow.ts

export interface PageInfo {
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  currPage: number; // 0-based
}

// 내가 팔로우한 회사 한 줄
export interface CompanyFollow {
  companyFollowId: number;
  companyId: number;
  name: string;
  companyProfileUrl: string | null;
}

// 내가 팔로우한 회원 한 줄
export interface MemberFollow {
  memberFollowId: number;
  memberId: number;
  nickname: string;
  memberProfileUrl: string; // 서버가 "" 줄 수도 있어 string 유지
  badgeUrl: string | null;
}

// 멤버 팔로우 목록 응답
export interface MemberFollowListResp {
  status: 'SUCCESS' | 'FAIL';
  data: {
    memberFollows: MemberFollow[];
    pageInfo: PageInfo;
  };
}

// 회사 팔로우 목록 응답
export interface CompanyFollowListResp {
  status: 'SUCCESS' | 'FAIL';
  data: {
    companyFollows: CompanyFollow[];
    pageInfo: PageInfo;
  };
}

// 등록/삭제 시 공통 응답 (서버가 어느 키를 주는지 케이스 분기)
export interface FollowMutateResp {
  status: 'SUCCESS' | 'FAIL';
  data: {
    memberFollowId?: number;
    companyFollowId?: number;
  };
}
