// 닉네임 중복 확인 API
const DUP_API = 'https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=';

export interface ProfileEditRequest {
  nickname: string;
  blogUrl: string;
  githubUrl?: string;
  profileImageUrl?: string | null;
  file?: File | null;
}

export interface DuplicateCheckResponse {
  data: {
    isDuplicated: boolean;
  };
}

// 닉네임 중복 확인
export async function checkNicknameDuplicate(
  nickname: string,
  signal?: AbortSignal
): Promise<boolean> {
  const response = await fetch(DUP_API + encodeURIComponent(nickname), {
    method: 'GET',
    signal,
  });
  
  const json = await response.json().catch(() => null);
  return !!json?.data?.isDuplicated;
}

// 프로필 수정 (실제 API 호출은 상위 컴포넌트에서 처리)
export function validateProfileData(data: ProfileEditRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!data.nickname?.trim()) {
    errors.push('닉네임을 입력해주세요.');
  }
  
  if (!data.blogUrl?.trim()) {
    errors.push('블로그 URL을 입력해주세요.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
