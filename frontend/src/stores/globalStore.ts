import { create } from 'zustand';

interface GlobalState {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ko' | 'en') => void;
}

export const globalStore = create<GlobalState>((set) => ({
  theme: 'light',
  language: 'ko',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));

export default globalStore; 