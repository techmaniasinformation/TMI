import { useState, useCallback } from 'react';
import { DEFAULT_IMAGES, handleImageError } from '@/utils/defaultImages';
/**
 * 이미지 에러 처리를 위한 커스텀 훅
 * 
 * 이미지 로딩 실패 시 기본 이미지로 대체하는 기능을 제공합니다.
 * 
 * @param originalSrc - 원본 이미지 URL
 * @param fallbackType - 대체할 이미지 타입 (기본값: 'GENERAL')
 * @returns 이미지 에러 처리 관련 상태와 함수들
 */
export const useImageError = (originalSrc, fallbackType = 'GENERAL') => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(originalSrc);
  const handleError = useCallback(event => {
    setHasError(true);
    setCurrentSrc(DEFAULT_IMAGES[fallbackType]);
    handleImageError(event, fallbackType);
  }, [fallbackType]);
  const resetError = useCallback(() => {
    setHasError(false);
    setCurrentSrc(originalSrc);
  }, [originalSrc]);
  return {
    hasError,
    currentSrc,
    handleError,
    resetError
  };
};