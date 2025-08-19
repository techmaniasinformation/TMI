import { getRequest, postRequest, deleteRequest } from './followApiClient';
import { handleFollowError } from './followErrorHandler';
import type { MemberFollowListResp, FollowMutateResp, MemberFollow } from '@/types/mypage/follow';

// 회원 팔로우 목록 조회
export async function getMemberFollows(
  followerId: number,
  page = 0,
  size = 9
): Promise<MemberFollowListResp> {
  try {
    const endpoint = `/memberFollow?followerId=${followerId}&page=${page}&size=${size}`;
    return await getRequest(endpoint);
  } catch (error) {
    throw handleFollowError(error, '사용자 팔로우 목록 조회 실패');
  }
}

// 회원 팔로우 생성
export async function createMemberFollow(
  followerId: number,
  followeeId: number
): Promise<FollowMutateResp> {
  try {
    const endpoint = '/memberFollow';
    const data = { followerId, followeeId };
    return await postRequest(endpoint, data);
  } catch (error) {
    throw handleFollowError(error, '팔로우 요청 처리 중 오류가 발생했습니다.');
  }
}

// 회원 언팔로우
export async function deleteMemberFollow(
  followerId: number, 
  followeeId: number
): Promise<FollowMutateResp> {
  try {
    const endpoint = `/memberFollow?followerId=${followerId}&followeeId=${followeeId}`;
    return await deleteRequest(endpoint);
  } catch (error) {
    throw handleFollowError(error, '언팔로우 처리 중 오류가 발생했습니다.');
  }
}

// 회원 팔로우 ID 찾기 (전용 API 없어서 목록에서 탐색)
export async function findMemberFollowId(
  followerId: number, 
  followeeId: number, 
  pageSize = 50
): Promise<number | null> {
  try {
    const list = await getMemberFollows(followerId, 0, pageSize);
    const hit = list.data.memberFollows.find((m: MemberFollow) => m.memberId === followeeId);
    return hit ? hit.memberFollowId : null;
  } catch (error) {
    throw handleFollowError(error, '팔로우 ID 조회 실패');
  }
}

