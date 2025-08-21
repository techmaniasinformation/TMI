import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useImageCompression } from '@/hooks/useImageCompression';

// 게시글 수정 UI 상태 관리 훅
export const usePostEditUIState = (postId?: string) => {
  const location = useLocation();
  
  // 이미지 압축 커스텀 훅 사용
  const imageCompression = useImageCompression();

  // UI 상태
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 기존 썸네일 URL 추적
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string>('');

  // 기존 게시글 데이터 로드
  useEffect(() => {
    const postData = location.state?.postData;
    if (postData) {
      if (postData.thumbnailUrl) {
        imageCompression.setExistingImageUrl(postData.thumbnailUrl);
        setOriginalThumbnailUrl(postData.thumbnailUrl);
      }
    } else {
      console.warn('Post data not found in location state.');
    }
  }, [location.state, postId, imageCompression.setExistingImageUrl]);

  // 미리보기 토글
  const togglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  return {
    // 상태
    isPreviewMode,
    originalThumbnailUrl,

    // 상태 관리
    togglePreview,

    // 이미지 압축
    ...imageCompression
  };
};
