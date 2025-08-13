import { useState } from 'react';
import imageCompression from 'browser-image-compression';

/**
 * 이미지 압축 커스텀 훅
 * 
 * 이미지 업로드, 압축, 미리보기 기능을 제공하는 재사용 가능한 훅입니다.
 * 
 * 사용법:
 * 1. 훅을 import하고 사용
 * 2. handleImageUpload를 input의 onChange에 연결
 * 3. imagePreview로 미리보기 표시
 * 4. selectedImage로 압축된 파일 접근
 * 5. handleImageCancel로 이미지 취소
 * 
 * 지원 파일 형식: jpg, jpeg, png, gif
 * 최대 파일 크기: 10MB
 * 압축 후 최대 크기: 1MB
 * 최대 해상도: 1920px
 * 
 * @returns {UseImageCompressionReturn} 이미지 압축 관련 상태와 함수들
 */

interface UseImageCompressionReturn {
  /** 압축된 이미지 파일 (File 객체) */
  selectedImage: File | null;
  /** 이미지 미리보기 URL (base64 또는 URL) */
  imagePreview: string;
  /** 이미지 압축 처리 중 여부 */
  isImageProcessing: boolean;
  /** 원본 파일 크기 (bytes) */
  originalFileSize: number;
  /** 이미지 업로드 및 압축 처리 함수 */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** 이미지 취소 및 초기화 함수 */
  handleImageCancel: () => void;
  /** 이미지 미리보기 URL 설정 함수 */
  setImagePreview: (url: string) => void;
}

export const useImageCompression = (): UseImageCompressionReturn => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);

  /**
   * 이미지 업로드 및 압축 처리 함수
   * 
   * 파일 선택 시 자동으로 압축을 수행하고 미리보기를 생성합니다.
   * 지원 형식: jpg, jpeg, png, gif
   * 최대 크기: 10MB
   * 
   * @param event - 파일 입력 이벤트
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileInput = event.target;

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('jpg, jpeg, png, gif 형식의 이미지만 업로드할 수 있습니다.');
        fileInput.value = '';
        return;
      }

      // 파일 크기 체크 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        fileInput.value = '';
        return;
      }

      setIsImageProcessing(true);
      try {
        // 원본 파일 크기 저장
        setOriginalFileSize(file.size);
        
        // 이미지 압축 옵션 설정
        const options = {
          maxSizeMB: 1, // 최대 1MB
          maxWidthOrHeight: 1920, // 최대 너비/높이
          useWebWorker: true,
          fileType: file.type
        };

        // 이미지 압축 실행
        const compressedFile = await imageCompression(file, options);
        
        // 압축된 파일을 상태에 저장 - File 객체만 허용
        if (compressedFile && compressedFile instanceof File) {
          setSelectedImage(compressedFile);
        } else if (compressedFile && (compressedFile as any) instanceof Blob) {
          // Blob을 File로 변환
          const blob = compressedFile as Blob;
          const fileFromBlob = new File([blob], 'compressed-image.jpg', { 
            type: blob.type || 'image/jpeg' 
          });
          setSelectedImage(fileFromBlob);
        } else {
          console.error('압축된 파일이 유효하지 않음:', compressedFile);
          throw new Error('이미지 압축 결과가 유효하지 않습니다.');
        }
        
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
        
      } catch (error) {
        console.error('이미지 압축 실패:', error);
        alert('이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsImageProcessing(false);
      }
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
    setImagePreview('');
    setOriginalFileSize(0);
    // 파일 입력 필드 초기화
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return {
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,
    handleImageUpload,
    handleImageCancel,
    setImagePreview
  };
};
