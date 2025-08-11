import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 사용자 정보를 정의하는 타입 (간단 예시 — 실제 타입에 맞게 수정)
interface User {
  memberId: number;
  nickname: string;
  memberProfileUrl: string;
}

//신규 가입자 
interface NewUser {
  provider: string;
  providerMemberId: string;
}

interface UserState {
  isLogin: boolean; // 페이지 구현되면 삭제 예정
  memberId: number;
  user: User | null;
  newUser: NewUser | null;
  starLst: number[];
  followUser: number[];
  followCompany: number[];
  
  // 소셜 로그인 정보
  socialProvider: string | null;
  socialProviderId: string | null;

  toggleIsLogin: () => void;
  setMemberId: (id: number) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setStarLst: (list: any[]) => void;
  setFollowUser: (list: any[]) => void;
  setFollowCompany: (list: any[]) => void;
  setSocialLoginInfo: (provider: string, providerId: string) => void;
  clearSocialLoginInfo: () => void;

  // checkAuth는 지울 예정
  checkAuth: () => Promise<void>; // ✅ (임시) 서버로부터 사용자 인증 상태 확인
  // 위의 checkAuth는 지울 예정
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isLogin: false, // 기능 수정 후 isLogin 변수 삭제 예정
      memberId: -1,
      user: null,
      newUser: null,  // 신규 회원 정보
      starLst: [],
      followUser: [],
      followCompany: [],
      socialProvider: null,
      socialProviderId: null,

      toggleIsLogin: () => set((state) => ({ isLogin: !state.isLogin })),

      setMemberId: (id: number) => set({ 
        memberId: id, 
        // isLogin: id !== -1 
      }),

      setNewUSer: (newUser: NewUser) => set({
        newUser,
      }),

      setUser: (user: User) => set({ 
        user, 
        // isLogin: user !== null 
      }),

      clearUser: () => set({ 
        user: null, 
        memberId: -1,
        // isLogin: false 
      }),
      setStarLst: (list: number[]) => set({ starLst: list }),
      setFollowUser: (list: number[]) => set({ followUser: list }),
      setFollowCompany: (list: number[]) => set({ followCompany: list }),
      setSocialLoginInfo: (provider: string, providerId: string) => 
        set({ socialProvider: provider, socialProviderId: providerId }),
      clearSocialLoginInfo: () => set({ socialProvider: null, socialProviderId: null }),

      // 지울 예정
      checkAuth: async () => {
        // ✅ (임시)
        try {
          const res = await fetch(
            'https://i13a509.p.ssafy.io/api/v1/members/me',
            {
              credentials: 'include', // ✅ 쿠키 포함 필수
            }
          );

          if (res.ok) {
            const data: User = await res.json();
            set({
              isLogin: true,
              user: data, // ✅ (임시)
              // memberId: data.memberId,
            });
          } else {
            set({
              isLogin: false,
              user: null, // ✅ (임시)
              memberId: -1,
            });
          }
        } catch (error) {
          console.error('checkAuth error:', error);
          set({
            isLogin: false,
            user: null, // ✅ (임시)
            memberId: -1,
          });
        }
      },
    }),
    { name: 'userStateStorage' }
  )
);

// ✅ 브라우저 콘솔 디버깅용: 전역 노출
// 개발 완료 후 삭제해야함6
if (typeof window !== 'undefined') {
  (window as any).userStore = useUserStore;
}
