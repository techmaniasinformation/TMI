import { useImageCompressionState } from './image/useImageCompressionState';
import { useImageCompressionActions } from './image/useImageCompressionActions';

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
 * - 이미지 비율 검증 (가로/세로 비율 0.5~2.0, 범위 벗어나면 alert)
 * - 파일 확장자와 MIME 타입 일치성 검증
 * - 빈 파일 및 너무 작은 파일 차단
 * - 강화된 파일 헤더 시그니처 검증 (실제 이미지 파일인지 확인)
 * - 다층 보안 검증 (Magic Bytes, 파일 크기, 이미지 로드 테스트)
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
 * 최대 파일 크기: 10MB (초과 시 팝업창 표시)
 * 최소 파일 크기: 1KB (미만 시 팝업창 표시)
 * 압축 후 최대 크기: 1MB
 * 최대 해상도: 1920px
 * 허용 이미지 비율: 0.5 ~ 2.0 (가로/세로, 범위 벗어나면 alert)
 * 파일 헤더 검증: PNG, JPEG, GIF 시그니처 확인 (Magic Bytes)
 * 보안 검증: 파일 크기, 확장자-MIME 일치성, 실제 이미지 로드 테스트
 *
 * @returns {UseImageCompressionReturn} 이미지 압축 관련 상태와 함수들
 */

interface UseImageCompressionReturn {
  /** 압축된 이미지 파일 (File 객체) */
  selectedImage: File | null;
  // 추가
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
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

// 이미지 압축 훅
export const useImageCompression = (): UseImageCompressionReturn => {
  const state = useImageCompressionState();
  const actions = useImageCompressionActions(state);

  return {
    // 상태
    selectedImage: state.selectedImage,
    imagePreview: state.imagePreview,
    isImageProcessing: state.isImageProcessing,
    originalFileSize: state.originalFileSize,
    existingImageUrl: state.existingImageUrl,

    // 상태 설정
    setSelectedImage: state.setSelectedImage,
    setImagePreview: state.setImagePreview,
    setExistingImageUrl: state.setExistingImageUrl,

    // 액션
    handleImageUpload: actions.handleImageUpload,
    handleImageCancel: actions.handleImageCancel,

    // 유틸리티
    clearExistingImageUrl: state.clearExistingImageUrl,
  };
};