// src/stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create(persist(set => ({
  isDarkMode: false,
  toggleTheme: () => set(state => ({
    isDarkMode: !state.isDarkMode
  }))
}), {
  name: 'themeStorage'
}));

// ✅ 브라우저 콘솔 디버깅용: 전역 노출
// 개발 완료 후 삭제해야함
if (typeof window !== 'undefined') {
  window.themeStore = useThemeStore;
}