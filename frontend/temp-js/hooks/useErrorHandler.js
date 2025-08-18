import { useState, useCallback } from 'react';
export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const handleError = useCallback((err, context) => {
    console.error(`❌ [${context}]`, err);
    setError(err);
    // 자동으로 3초 후 에러 초기화
    setTimeout(() => setError(null), 3000);
  }, []);
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  return {
    error,
    handleError,
    clearError,
    hasError: error !== null
  };
};