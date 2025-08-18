// 팔로우 서비스 통합 인터페이스
// 기존 API 호환성을 위해 모든 함수를 재export

// 회원 팔로우 서비스
export {
  getMemberFollows,
  createMemberFollow,
  deleteMemberFollow,
  findMemberFollowId
} from './follow/memberFollowService';

// 회사 팔로우 서비스
export {
  getCompanyFollows,
  createCompanyFollow,
  deleteCompanyFollow,
  findCompanyFollowId
} from './follow/companyFollowService';

// 타입 재export
export type {
  MemberFollowListResp,
  CompanyFollowListResp,
  FollowMutateResp,
  MemberFollow,
  CompanyFollow,
} from '@/types/mypage/follow';
