// src/stores/useStore.ts
import { create } from 'zustand';

interface UserState {
  isLogin: boolean;
  memberId: number;
  toggleIsLogin: () => void;
  setMemberId: (id: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLogin:false,
//   isLogin:true,
  memberId: -1, // 로그인하지 않은 상태일 때 -1로 설정
  // 인증 완성되면 access 토큰에 저장
  toggleIsLogin: () => set((state) => ({ isLogin: !state.isLogin })),
  setMemberId: (id: number) => set({ memberId: id }), // 실제 memberFId 업데이트
}));
