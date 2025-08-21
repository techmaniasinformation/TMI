// 인증 관련 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  data?: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// 회원가입 API
export const signup = async (signupData: SignupRequest): Promise<SignupResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  if (!response.ok) {
    throw new Error(`회원가입 API 호출 실패: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
