// src/stores/themeStore.ts
import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));


// ✅ 브라우저 콘솔 디버깅용: 전역 노출
// 개발 완료 후 삭제해야함
if (typeof window !== 'undefined') {
  (window as any).themeStore = useThemeStore;
}