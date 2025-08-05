// 인증 관련 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'kakao' | 'naver';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  provider: 'google' | 'kakao' | 'naver';
  code: string;
  redirectUri: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}