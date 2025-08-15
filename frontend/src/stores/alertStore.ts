import { create } from 'zustand';

interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isVisible: boolean;
}

interface AlertStore {
  alertState: AlertState;
  showAlert: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  hideAlert: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alertState: {
    message: '',
    type: 'info',
    duration: 3000,
    isVisible: false
  },

  showAlert: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number) => {
    set({
      alertState: {
        message,
        type,
        duration: duration || 3000,
        isVisible: true
      }
    });

    // 자동으로 숨기기
    setTimeout(() => {
      get().hideAlert();
    }, duration || 3000);
  },

  hideAlert: () => {
    set(state => ({
      alertState: {
        ...state.alertState,
        isVisible: false
      }
    }));
  },

  showSuccess: (message: string, duration?: number) => {
    get().showAlert(message, 'success', duration);
  },

  showError: (message: string, duration?: number) => {
    get().showAlert(message, 'error', duration);
  },

  showWarning: (message: string, duration?: number) => {
    get().showAlert(message, 'warning', duration);
  },

  showInfo: (message: string, duration?: number) => {
    get().showAlert(message, 'info', duration);
  }
}));
