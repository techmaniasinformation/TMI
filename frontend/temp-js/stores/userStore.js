import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 사용자 정보를 정의하는 타입 (간단 예시 — 실제 타입에 맞게 수정)

// 신규 가입자

export const useUserStore = create(persist((set, get) => ({
  isLogin: false,
  // 기능 수정 후 isLogin 변수 삭제 예정
  user: null,
  newUser: null,
  // 신규 회원 정보
  followUser: [],
  followCompany: [],
  socialProvider: null,
  socialProviderId: null,
  prevPath: '/',
  // 이전 페이지

  toggleIsLogin: () => set(state => ({
    isLogin: !state.isLogin
  })),
  // ✅ (정식) 새 사용자 설정
  setNewUser: newUser => set({
    newUser
  }),
  // ✅ (호환) 기존 오타 메서드도 남겨서 내부적으로 정식 메서드 호출
  setNewUSer: newUser => set({
    newUser
  }),
  setUser: user => set({
    user,
    isLogin: user !== null
  }),
  clearUser: () => set({
    user: null,
    isLogin: false
  }),
  setFollowUser: list => set({
    followUser: list
  }),
  setFollowCompany: list => set({
    followCompany: list
  }),
  setSocialLoginInfo: (provider, providerId) => set({
    socialProvider: provider,
    socialProviderId: providerId
  }),
  // ✅ provider도 함께 초기화 (보완)
  clearSocialLoginInfo: () => set({
    socialProvider: null,
    socialProviderId: null
  }),
  // 이전 페이지 지정
  setPrevPath: path => set({
    prevPath: path
  }),
  setSocialProvider: provider => set({
    socialProvider: provider
  }),
  // ✅ (추가) 헤더 즉시 반영용 부분 업데이트
  updateUserProfile: patch => set(state => state.user ? {
    user: {
      ...state.user,
      ...patch
    }
  } : state),
  // 지울 예정
  checkAuth: async () => {
    // ✅ (임시)
    try {
      const res = await fetch('https://i13a509.p.ssafy.io/api/v1/members/me', {
        credentials: 'include' // ✅ 쿠키 포함 필수
      });
      if (res.ok) {
        const data = await res.json();
        set({
          isLogin: true,
          user: data // ✅ (임시)
        });
      } else {
        set({
          isLogin: false,
          user: null // ✅ (임시)
        });
      }
    } catch (error) {
      console.error('checkAuth error:', error);
      set({
        isLogin: false,
        user: null // ✅ (임시)
      });
    }
  }
}), {
  name: 'userStateStorage'
}));