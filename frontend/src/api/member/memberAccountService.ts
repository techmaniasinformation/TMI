import { patchRequest } from './memberApiClient';
import { handleMemberError } from './memberErrorHandler';

// 회원 탈퇴
export async function deleteMember(memberId: number): Promise<boolean> {
  try {
    const data = await patchRequest(`/member/${memberId}/delete`);
    
    // 응답 바디가 있을 때만 상태 체크
    if (data?.status && data.status !== "SUCCESS") {
      console.warn("회원탈퇴 실패: API 상태 비정상", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("회원탈퇴 중 오류:", error);
    throw handleMemberError(error, '회원탈퇴 실패');
  }
}

