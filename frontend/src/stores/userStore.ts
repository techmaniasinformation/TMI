import { create } from 'zustand';

// 사용자 정보를 정의하는 타입 (간단 예시 — 실제 타입에 맞게 수정)
interface User {
  memberId:number;
  nickname: string;
  memberProfileUrl: string;
}

interface UserState {
  isLogin: boolean;
  memberId: number;
  user: User | null;
  myStarLst: number[];
  myFollowLst: number[];

  toggleIsLogin: () => void;
  setMemberId: (id: number) => void;
  setUser: (user: User) => void;  
    setMyStarLst: (list: any[]) => void;
  setMyFollowLst: (list: any[]) => void;

  // checkAuth는 지울 예정 
  checkAuth: () => Promise<void>;     // ✅ (임시) 서버로부터 사용자 인증 상태 확인
// 위의 checkAuth는 지울 예정
}

export const useUserStore = create<UserState>((set) => ({
  isLogin: false, // 기능 수정 후 isLogin 변수 삭제 예정 
  memberId: -1,
  user: null, 
  myStarLst: [],
  myFollowLst: [],                         


  toggleIsLogin: () => set((state) => ({ isLogin: !state.isLogin })),

  setMemberId: (id: number) => set({ memberId: id }),

  setUser: (user: User) => set({ user }), 
setMyStarLst: (list:number[]) => set({ myStarLst: list }),
setMyFollowLst: (list:number[]) => set({ myFollowLst: list }),


  // 지울 예정 
  checkAuth: async () => {                // ✅ (임시)
    try {
      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/members/me', {
        credentials: 'include',          // ✅ 쿠키 포함 필수
      });

      if (res.ok) {
        const data: User = await res.json();
        set({
          isLogin: true,
          user: data,                    // ✅ (임시)
          // memberId: data.memberId,
        });
      } else {
        set({
          isLogin: false,
          user: null,                    // ✅ (임시)
          memberId: -1,
        });
      }
    } catch (error) {
      console.error('checkAuth error:', error);
      set({
        isLogin: false,
        user: null,                      // ✅ (임시)
        memberId: -1,
      });
    }
  },
}));
