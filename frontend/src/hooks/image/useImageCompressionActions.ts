import { useCallback } from 'react';
import {
  validateFileSize,
  validateFileType,
  detectActualType,
  validateImageRatio,
  compressImage,
  fileToBase64,
} from '@/utils/imageCompressionUtils';
import type { useImageCompressionState } from './useImageCompressionState';

// 이미지 압축 액션 훅
export const useImageCompressionActions = (
  state: ReturnType<typeof useImageCompressionState>
) => {
  const {
    existingImageUrl,
    setSelectedImage,
    setImagePreview,
    setIsImageProcessing,
    setOriginalFileSize,
    setExistingImageUrl,
  } = state;

  /**
   * 이미지 업로드 및 압축 처리 함수
   */
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileInput = event.target;

    if (!file) return;

    // 1. 기본 크기 검증
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.isValid) {
      alert(sizeValidation.error);
      fileInput.value = '';
      return;
    }

    // 2. 확장자 ↔ MIME 일치성 검증
    const typeValidation = validateFileType(file);
    if (!typeValidation.isValid) {
      alert(typeValidation.error);
      fileInput.value = '';
      return;
    }

    // 3. 매직바이트로 실제 타입 판별
    let actual: string | null = null;
    try {
      actual = await detectActualType(file);
    } catch {
      // 읽기 실패
    }
    if (!actual || actual !== file.type) {
      alert(
        `파일 헤더가 실제 이미지 형식과 일치하지 않습니다.\n\n파일명: ${file.name}\n확장자/MIME: ${file.type}\n실제감지: ${actual ?? '미확인'}\n\n올바른 이미지 파일을 업로드해주세요.`
      );
      fileInput.value = '';
      return;
    }

    // 4. 디코드 테스트
    try {
      const { canDecodeImage } = await import('@/utils/imageCompressionUtils');
      const decodable = await canDecodeImage(file);
      if (!decodable) {
        alert('이미지 파일을 디코드할 수 없습니다. 손상되었거나 지원하지 않는 형식입니다.');
        fileInput.value = '';
        return;
      }
    } catch (error) {
      console.error('이미지 디코드 테스트 실패:', error);
      fileInput.value = '';
      return;
    }

    setIsImageProcessing(true);
    try {
      // 기존 이미지 URL 초기화 (새 이미지 업로드 시)
      if (existingImageUrl) setExistingImageUrl('');

      // 원본 파일 크기 저장
      setOriginalFileSize(file.size);

      // 5. 이미지 비율 검증
      const ratioValidation = await validateImageRatio(file);
      if (!ratioValidation.isValid) {
        alert(ratioValidation.error);
        fileInput.value = '';
        setIsImageProcessing(false);
        return;
      }

      // 6. 이미지 압축 실행
      const compressed = await compressImage(file);

      // 7. 미리보기 생성
      const preview = await fileToBase64(compressed);
      setImagePreview(preview);

      // 8. 상태 저장
      setSelectedImage(compressed);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
      fileInput.value = '';
      // 실패 시 원래 상태 유지(기존 URL 있으면 그대로)
    } finally {
      setIsImageProcessing(false);
    }
  }, [existingImageUrl, setSelectedImage, setImagePreview, setIsImageProcessing, setOriginalFileSize, setExistingImageUrl]);

  /**
   * 이미지 취소 및 초기화 함수
   */
  const handleImageCancel = useCallback(() => {
    setSelectedImage(null);
    setOriginalFileSize(0);
    setImagePreview('');
    setExistingImageUrl(''); // 기존 이미지 URL도 함께 초기화

    // 파일 입력 필드 초기화
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [setSelectedImage, setOriginalFileSize, setImagePreview, setExistingImageUrl]);

  return {
    // 액션
    handleImageUpload,
    handleImageCancel,
  };
};

