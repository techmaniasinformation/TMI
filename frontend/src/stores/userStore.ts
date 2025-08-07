// src/stores/userStore.ts
import { create } from 'zustand';

interface User {
  memberId: number;
  name: string;
  email?: string;
  profileUrl?: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  login: (provider: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<AuthStore>((set, get) => ({
  // 실제 인증 상태로 초기화
  isAuthenticated: true,
  user: {
    memberId: 1,
    name: 'test',
    email: 'test@test.com',
    profileUrl: 'https://i13a509.p.ssafy.io/api/v1/member/me',
  },
  isLoading: false,
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  login: async (provider: string) => {
    console.log(`[AUTH] 소셜 로그인 시작: ${provider}`);
    set({ isLoading: true });
    
    try {
      const oauthUrl = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
      console.log(`[AUTH] OAuth URL로 리다이렉트: ${oauthUrl}`);
      
      // OAuth 2.0 인증을 위해 사용자를 리다이렉트
      window.location.href = oauthUrl;
    } catch (error) {
      console.error(`[AUTH] 소셜 로그인 오류 (${provider}):`, error);
      set({ isLoading: false });
    }
  },
  
  checkAuth: async () => {
    console.log('[AUTH] 인증 상태 확인 시작');
    try {
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/member/me', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 필수
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`[AUTH] 인증 확인 응답 상태: ${response.status}`);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('[AUTH] 사용자 정보 받음:', userData);
        set({ 
          isAuthenticated: true, 
          user: userData.data, 
          isLoading: false 
        });
        console.log('[AUTH] 인증 성공 - 로그인 상태 업데이트');
      } else {
        console.log(`[AUTH] 인증 실패 - 상태 코드: ${response.status}`);
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('[AUTH] 인증 확인 오류:', error);
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    console.log('[AUTH] 로그아웃 시작');
    set({ isLoading: true });
    
    try {
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함 필수
      });
      
      console.log(`[AUTH] 로그아웃 응답 상태: ${response.status}`);
      
      if (response.ok) {
        console.log('[AUTH] 로그아웃 성공');
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
      } else {
        console.error(`[AUTH] 로그아웃 실패 - 상태 코드: ${response.status}`);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('[AUTH] 로그아웃 오류:', error);
      set({ isLoading: false });
    }
  },
}));
