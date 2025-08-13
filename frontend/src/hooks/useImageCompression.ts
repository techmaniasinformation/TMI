import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

/**
 * 이미지 압축 커스텀 훅
 * 
 * 이미지 업로드, 압축, 미리보기 기능을 제공하는 재사용 가능한 훅입니다.
 * 작성 페이지와 수정 페이지 모두에서 사용할 수 있습니다.
 * 
 * 주요 기능:
 * - 이미지 파일 업로드 및 압축 (최대 1MB)
 * - 미리보기 생성 (base64 또는 URL)
 * - 기존 이미지 URL 관리 (수정 페이지용)
 * - 파일 형식 및 크기 검증
 * 
 * 사용법:
 * 1. 훅을 import하고 사용
 * 2. handleImageUpload를 input의 onChange에 연결
 * 3. imagePreview로 미리보기 표시
 * 4. selectedImage로 압축된 파일 접근
 * 5. handleImageCancel로 이미지 취소
 * 6. setExistingImageUrl로 기존 이미지 URL 설정 (수정 페이지용)
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
  /** 기존 이미지 URL (수정 페이지용) */
  existingImageUrl: string;
  /** 이미지 업로드 및 압축 처리 함수 */
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** 이미지 취소 및 초기화 함수 */
  handleImageCancel: () => void;
  /** 이미지 미리보기 URL 설정 함수 */
  setImagePreview: (url: string) => void;
  /** 기존 이미지 URL 설정 함수 (수정 페이지용) */
  setExistingImageUrl: (url: string) => void;
  /** 기존 이미지 URL 초기화 함수 */
  clearExistingImageUrl: () => void;
}

export const useImageCompression = (): UseImageCompressionReturn => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  /**
   * 기존 이미지 URL이 설정되면 imagePreview에 반영
   */
  useEffect(() => {
    if (existingImageUrl && !imagePreview) {
      setImagePreview(existingImageUrl);
    }
  }, [existingImageUrl, imagePreview]);

  /**
   * 이미지 업로드 및 압축 처리 함수
   * 
   * 파일 선택 시 자동으로 압축을 수행하고 미리보기를 생성합니다.
   * 기존 이미지가 있는 경우 자동으로 초기화합니다.
   * 
   * @param event - 파일 입력 이벤트
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileInput = event.target;

    if (file) {
      // 파일 형식 검증
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('jpg, jpeg, png, gif 형식의 이미지만 업로드할 수 있습니다.');
        fileInput.value = '';
        return;
      }

      // 파일 크기 검증 (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        fileInput.value = '';
        return;
      }

      setIsImageProcessing(true);
      try {
        // 기존 이미지 URL 초기화 (새 이미지 업로드 시)
        if (existingImageUrl) {
          setExistingImageUrl('');
        }

        // 원본 파일 크기 저장
        setOriginalFileSize(file.size);
        
        // 이미지 압축 옵션 설정
        const options = {
          maxSizeMB: 1, // 최대 1MB
          maxWidthOrHeight: 1920, // 최대 해상도
          useWebWorker: true,
          fileType: file.type
        };

        // 이미지 압축 실행
        const compressedFile = await imageCompression(file, options);
        
        // Blob을 File 객체로 변환
        let finalFile: File;
        
        if (compressedFile) {
          // 원본 파일명 유지 (가능한 경우)
          const fileName = (compressedFile as any).name || 'compressed-image.jpg';
          const fileType = compressedFile.type || 'image/jpeg';
          
          // File 객체로 생성
          finalFile = new File([compressedFile], fileName, { 
            type: fileType,
            lastModified: Date.now()
          });
        } else {
          console.error('압축된 파일이 유효하지 않음:', compressedFile);
          throw new Error('이미지 압축 결과가 유효하지 않습니다.');
        }
        
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(finalFile);
        
        // File 객체 저장
        setSelectedImage(finalFile);
        
      } catch (error) {
        console.error('이미지 압축 실패:', error);
        alert('이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsImageProcessing(false);
      }
    }
  };

  /**
   * 이미지 취소 및 초기화 함수
   * 
   * 선택된 이미지를 제거하고 모든 상태를 초기화합니다.
   * 기존 이미지가 있었으면 다시 표시합니다.
   */
  const handleImageCancel = () => {
    setSelectedImage(null);
    setOriginalFileSize(0);
    
    // 기존 이미지가 있었으면 다시 표시, 없으면 미리보기 초기화
    if (existingImageUrl) {
      setImagePreview(existingImageUrl);
    } else {
      setImagePreview('');
    }
    
    // 파일 입력 필드 초기화
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /**
   * 기존 이미지 URL 초기화 함수
   */
  const clearExistingImageUrl = () => {
    setExistingImageUrl('');
  };

  return {
    selectedImage,
    imagePreview,
    isImageProcessing,
    originalFileSize,
    existingImageUrl,
    handleImageUpload,
    handleImageCancel,
    setImagePreview,
    setExistingImageUrl,
    clearExistingImageUrl
  };
};
