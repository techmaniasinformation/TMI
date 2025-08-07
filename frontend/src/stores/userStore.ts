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
  isAuthenticated: false,
  user: null,
  isLoading: false,
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  login: async (provider: string) => {
    set({ isLoading: true });
    
    try {
      // OAuth 2.0 인증을 위해 사용자를 리다이렉트
      window.location.href = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
    } catch (error) {
      console.error('로그인 오류:', error);
      set({ isLoading: false });
    }
  },
  
  checkAuth: async () => {
    try {
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/member/me', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 필수
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        set({ 
          isAuthenticated: true, 
          user: userData.data, 
          isLoading: false 
        });
      } else {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      const response = await fetch('https://i13a509.p.ssafy.io/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함 필수
      });
      
      if (response.ok) {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
      } else {
        console.error('로그아웃 실패:', response.status);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      set({ isLoading: false });
    }
  },
}));
