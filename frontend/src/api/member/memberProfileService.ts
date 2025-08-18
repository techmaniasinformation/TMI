import { getRequest, patchFormRequest } from './memberApiClient';
import { handleMemberError } from './memberErrorHandler';
import type { 
  MemberResponse, 
  MemberData, 
  UpdateMemberRequest, 
  UpdateMemberResponse 
} from "@/types/mypage/member";

// 회원 정보 조회
export async function fetchMemberProfile(memberId: number): Promise<MemberData | null> {
  try {
    const data: MemberResponse = await getRequest<MemberResponse>(`/member/${memberId}`);
    
    if (data?.status !== "SUCCESS") {
      console.warn("API 응답 상태 실패", data);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error("유저 정보 조회 중 오류:", error);
    throw handleMemberError(error, '유저 정보 조회 실패');
  }
}

// FormData 구성 헬퍼
function buildFormData(body: UpdateMemberRequest): FormData {
  const formData = new FormData();
  const isFileUpload = body.file instanceof Blob;

  // req(JSON) 구성 — 수정 의도가 있는 필드만 추가
  const requestPayload: Record<string, any> = {};
  
  if (body.nickname !== undefined) requestPayload.nickname = body.nickname;
  if (body.blogUrl !== undefined) requestPayload.blogUrl = body.blogUrl ?? null;
  if (body.githubUrl !== undefined) requestPayload.githubUrl = body.githubUrl ?? null;

  if (!isFileUpload && "memberProfileUrl" in body) {
    // null → 삭제, string → 외부 URL 교체
    requestPayload.memberProfileUrl = body.memberProfileUrl;
  }

  formData.append("req", new Blob([JSON.stringify(requestPayload)], { type: "application/json" }));
  
  if (isFileUpload) {
    formData.append("profileImage", body.file as File);
  }

  return formData;
}

// 회원 정보 수정
export async function updateMemberProfile(
  memberId: number,
  body: UpdateMemberRequest
): Promise<number | null> {
  try {
    const formData = buildFormData(body);
    const data: UpdateMemberResponse = await patchFormRequest<UpdateMemberResponse>(`/member/${memberId}`, formData);

    if (data?.status === "SUCCESS") {
      return data.data.memberId;
    } else {
      console.warn("프로필 수정 실패: API 상태 비정상", data);
      return null;
    }
  } catch (error) {
    console.error("프로필 수정 중 오류:", error);
    throw handleMemberError(error, '프로필 수정 실패');
  }
}
