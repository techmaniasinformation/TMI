import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 사용자 정보를 정의하는 타입 (간단 예시 — 실제 타입에 맞게 수정)
interface User {
  memberId: number;
  nickname: string;
  memberProfileUrl: string | null;        // ✅ null 허용 (이미지 삭제 케이스)
}

// 신규 가입자
interface NewUser {
  provider: string;
  providerMemberId: string;
}

interface UserState {
  isLogin: boolean; // 페이지 구현되면 삭제 예정
  user: User | null;
  newUser: NewUser | null;
  starLst: string[];
  starIdMap: Map<string, number>; // postId -> starId 매핑
  followUser: number[];
  followCompany: number[];

  // 소셜 로그인 정보
  socialProvider: string | null;
  socialProviderId: string | null;

  // 이전 페이지
  prevPath: string | '/';

  // === 기존 액션들 (유지) ===
  toggleIsLogin: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setStarLst: (list: string[]) => void;
  setStarIdMap: (map: Map<string, number>) => void;
  addStarId: (postId: string, starId: number) => void;
  removeStarId: (postId: string) => void;
  setFollowUser: (list: any[]) => void;
  setFollowCompany: (list: any[]) => void;
  setSocialLoginInfo: (provider: string, providerId: string) => void;
  clearSocialLoginInfo: () => void;
  setPrevPath: (path: string) => void;
  setSocialProvider: (provider: string) => void;

  // ✅ (추가) 헤더 즉시 반영을 위한 부분 업데이트 액션
  updateUserProfile: (patch: Partial<Pick<User, 'nickname' | 'memberProfileUrl'>>) => void;

  // ✅ (호환 유지) 기존 오타 메서드 유지
  setNewUSer?: (newUser: NewUser) => void;
  // ✅ (정식) 올바른 이름 메서드 추가
  setNewUser: (newUser: NewUser) => void;

  // checkAuth는 지울 예정
  checkAuth: () => Promise<void>; // ✅ (임시) 서버로부터 사용자 인증 상태 확인
  // 위의 checkAuth는 지울 예정
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isLogin: false, // 기능 수정 후 isLogin 변수 삭제 예정
      user: null,
      newUser: null, // 신규 회원 정보
      starLst: [],
      starIdMap: new Map(),
      followUser: [],
      followCompany: [],
      socialProvider: null,
      socialProviderId: null,

      prevPath: '/', // 이전 페이지

      toggleIsLogin: () => set((state) => ({ isLogin: !state.isLogin })),

      // ✅ (정식) 새 사용자 설정
      setNewUser: (newUser: NewUser) => set({ newUser }),
      // ✅ (호환) 기존 오타 메서드도 남겨서 내부적으로 정식 메서드 호출
      setNewUSer: (newUser: NewUser) => set({ newUser }),

      setUser: (user: User) =>
        set({
          user,
          // isLogin: user !== null
        }),

      clearUser: () =>
        set({
          user: null,
          // isLogin: false
        }),

      setStarLst: (list: string[]) => set({ starLst: list }),
      setStarIdMap: (map: Map<string, number>) => set({ starIdMap: map }),
      addStarId: (postId: string, starId: number) => 
        set((state) => {
          const newMap = new Map(state.starIdMap);
          newMap.set(postId, starId);
          return { starIdMap: newMap };
        }),
      removeStarId: (postId: string) => 
        set((state) => {
          const newMap = new Map(state.starIdMap);
          newMap.delete(postId);
          return { starIdMap: newMap };
        }),
      setFollowUser: (list: number[]) => set({ followUser: list }),
      setFollowCompany: (list: number[]) => set({ followCompany: list }),

      setSocialLoginInfo: (provider: string, providerId: string) =>
        set({ socialProvider: provider, socialProviderId: providerId }),

      // ✅ provider도 함께 초기화 (보완)
      clearSocialLoginInfo: () => set({ socialProvider: null, socialProviderId: null }),

      // 이전 페이지 지정
      setPrevPath: (path: string) => set({ prevPath: path }),

      setSocialProvider: (provider: string) => set({ socialProvider: provider }),

      // ✅ (추가) 헤더 즉시 반영용 부분 업데이트
      updateUserProfile: (patch) =>
        set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),

      // 지울 예정
      checkAuth: async () => {
        // ✅ (임시)
        try {
          const res = await fetch('https://i13a509.p.ssafy.io/api/v1/members/me', {
            credentials: 'include', // ✅ 쿠키 포함 필수
          });

          if (res.ok) {
            const data: User = await res.json();
            set({
              isLogin: true,
              user: data, // ✅ (임시)
            });
          } else {
            set({
              isLogin: false,
              user: null, // ✅ (임시)
            });
          }
        } catch (error) {
          console.error('checkAuth error:', error);
          set({
            isLogin: false,
            user: null, // ✅ (임시)
          });
        }
      },
    }),
    { 
      name: 'userStateStorage',
      serialize: (state) => {
        // Map 객체를 배열로 변환하여 직렬화
        const serializedState = {
          ...state,
          starIdMap: Array.from(state.starIdMap.entries())
        };
        return JSON.stringify(serializedState);
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        // 배열을 다시 Map으로 변환
        return {
          ...parsed,
          starIdMap: new Map(parsed.starIdMap || [])
        };
      }
    }
  )
);
