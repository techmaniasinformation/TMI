import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  isLoading: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  };
  setModalOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
}

export const uiStore = create<UIState>((set) => ({
  isModalOpen: false,
  isLoading: false,
  toast: {
    message: '',
    type: 'info',
    isVisible: false,
  },
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setLoading: (loading) => set({ isLoading: loading }),
  showToast: (message, type) => set({
    toast: { message, type, isVisible: true }
  }),
  hideToast: () => set({
    toast: { message: '', type: 'info', isVisible: false }
  }),
}));

export default uiStore; 