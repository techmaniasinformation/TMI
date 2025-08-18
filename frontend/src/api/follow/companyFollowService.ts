import { getRequest, postRequest, deleteRequest } from './followApiClient';
import { handleFollowError } from './followErrorHandler';
import type { CompanyFollowListResp, FollowMutateResp, CompanyFollow } from '@/types/mypage/follow';

// 회사 팔로우 목록 조회
export async function getCompanyFollows(
  followerId: number,
  page = 0,
  size = 9
): Promise<CompanyFollowListResp> {
  try {
    const endpoint = `/companyFollow?followerId=${followerId}&page=${page}&size=${size}`;
    return await getRequest(endpoint);
  } catch (error) {
    throw handleFollowError(error, '기업 팔로우 목록 조회 실패');
  }
}

// 회사 팔로우 생성
export async function createCompanyFollow(
  followerId: number,
  companyId: number
): Promise<FollowMutateResp> {
  try {
    const endpoint = '/companyFollow';
    const data = { followerId, companyId };
    return await postRequest(endpoint, data);
  } catch (error) {
    throw handleFollowError(error, '기업 팔로우 요청 처리 중 오류가 발생했습니다.');
  }
}

// 회사 언팔로우
export async function deleteCompanyFollow(
  followerId: number, 
  companyId: number
): Promise<FollowMutateResp> {
  try {
    const endpoint = `/companyFollow?followerId=${followerId}&companyId=${companyId}`;
    return await deleteRequest(endpoint);
  } catch (error) {
    throw handleFollowError(error, '기업 언팔로우 처리 중 오류가 발생했습니다.');
  }
}

// 회사 팔로우 ID 찾기
export async function findCompanyFollowId(
  followerId: number, 
  companyId: number, 
  pageSize = 50
): Promise<number | null> {
  try {
    const list = await getCompanyFollows(followerId, 0, pageSize);
    const hit = list.data.companyFollows.find((c: CompanyFollow) => c.companyId === companyId);
    return hit ? hit.companyFollowId : null;
  } catch (error) {
    throw handleFollowError(error, '기업 팔로우 ID 조회 실패');
  }
}
