import { useState, useCallback } from 'react';

interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isVisible: boolean;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    message: '',
    type: 'info',
    duration: 3000,
    isVisible: false
  });

  const showAlert = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number
  ) => {
    setAlertState({
      message,
      type,
      duration: duration || 3000,
      isVisible: true
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showAlert(message, 'success', duration);
  }, [showAlert]);

  const showError = useCallback((message: string, duration?: number) => {
    showAlert(message, 'error', duration);
  }, [showAlert]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showAlert(message, 'warning', duration);
  }, [showAlert]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showAlert(message, 'info', duration);
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
