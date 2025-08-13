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

type KnownMime = 'image/jpeg' | 'image/png' | 'image/gif';

const ALLOWED_TYPES: KnownMime[] = ['image/jpeg', 'image/png', 'image/gif'];
const EXT_TO_MIME: Record<string, KnownMime> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
};

// 정책 값
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_SIZE = 1024;             // 1KB
const POST_MIN_SIZE = 100;         // 헤더 통과 후 추가 최소(보수)
const MAX_DIMENSION = 1920;        // 압축 시 최대 변
const RATIO_MIN = 0.5;
const RATIO_MAX = 2.0;

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
   * 내부 유틸: 앞 N바이트 읽기
   */
  const readBytes = (file: File, n: number): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(new Uint8Array(e.target?.result as ArrayBuffer));
      };
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsArrayBuffer(file.slice(0, n));
    });

  /**
   * 내부 유틸: 매직바이트로 실제 MIME 판별 (PNG/JPEG/GIF)
   */
  const detectActualType = async (file: File): Promise<KnownMime | null> => {
    const b = await readBytes(file, 12);

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    if (png.every((v, i) => b[i] === v)) return 'image/png';

    // JPEG: FF D8 FF
    const jpg = [0xFF, 0xD8, 0xFF];
    if (jpg.every((v, i) => b[i] === v)) return 'image/jpeg';

    // GIF87a / GIF89a
    const gif87a = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
    const gif89a = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
    if (gif87a.every((v, i) => b[i] === v) || gif89a.every((v, i) => b[i] === v)) {
      return 'image/gif';
    }

    return null;
  };

  /**
   * 내부 유틸: 이미지 디코드 테스트 (createImageBitmap -> Image() 폴백)
   */
  const canDecodeImage = async (file: File): Promise<boolean> => {
    try {
      if ('createImageBitmap' in window) {
        const bmp = await createImageBitmap(file);
        // Safari 일부 버전 메모리 누수 방지
        // @ts-ignore
        bmp.close?.();
        return true;
      }
    } catch {
      /* 폴백 진행 */
    }

    return new Promise<boolean>((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      img.src = url;
    });
  };

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

    if (!file) return;

    // 기본 크기 검증
    if (file.size > MAX_SIZE) {
      alert(
        '파일 크기는 10MB 이하여야 합니다.\n\n현재 파일 크기: ' +
          (file.size / (1024 * 1024)).toFixed(2) +
          'MB\n허용 최대 크기: 10MB'
      );
      fileInput.value = '';
      return;
    }
    if (file.size === 0) {
      alert('빈 파일은 업로드할 수 없습니다.\n\n파일명: ' + file.name);
      fileInput.value = '';
      return;
    }
    if (file.size < MIN_SIZE) {
      alert(
        `파일 크기가 너무 작습니다.\n\n파일명: ${file.name}\n파일 크기: ${file.size} bytes\n\n유효한 이미지 파일인지 확인해주세요.`
      );
      fileInput.value = '';
      return;
    }

    // 확장자 ↔ MIME 일치성 1차 검증
    const fileName = file.name.toLowerCase();
    const ext = fileName.split('.').pop() || '';
    const extMime = EXT_TO_MIME[ext];
    if (!ALLOWED_TYPES.includes(file.type as KnownMime) || !extMime || extMime !== file.type) {
      alert(
        `jpg, jpeg, png, gif 형식만 업로드할 수 있습니다.\n\n파일명: ${file.name}\n확장자: .${ext}\n감지된 형식: ${file.type || '(알 수 없음)'}`
      );
      fileInput.value = '';
      return;
    }

    // 매직바이트로 실제 타입 판별 (2차 검증)
    let actual: KnownMime | null = null;
    try {
      actual = await detectActualType(file);
    } catch {
      // 읽기 실패
    }
    if (!actual || actual !== file.type) {
      alert(
        `파일 헤더가 실제 이미지 형식과 일치하지 않습니다.\n\n파일명: ${file.name}\n확장자/MIME: ${extMime}\n실제감지: ${actual ?? '미확인'}\n\n올바른 이미지 파일을 업로드해주세요.`
      );
      fileInput.value = '';
      return;
    }

    // 추가 보수 최소 크기
    if (file.size < POST_MIN_SIZE) {
      alert(
        `파일이 너무 작습니다. 유효한 이미지 파일이 아닐 수 있습니다.\n\n파일명: ${file.name}\n파일 크기: ${file.size} bytes`
      );
      fileInput.value = '';
      return;
    }

    // 디코드 테스트 (3차 검증)
    const decodable = await canDecodeImage(file);
    if (!decodable) {
      alert('이미지 파일을 디코드할 수 없습니다. 손상되었거나 지원하지 않는 형식입니다.');
      fileInput.value = '';
      return;
    }

    setIsImageProcessing(true);
    try {
      // 기존 이미지 URL 초기화 (새 이미지 업로드 시)
      if (existingImageUrl) setExistingImageUrl('');

      // 원본 파일 크기 저장
      setOriginalFileSize(file.size);

      // 이미지 비율 검증
      const testUrl = URL.createObjectURL(file);
      const sizeOk = await new Promise<File>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          URL.revokeObjectURL(testUrl);

          if (ratio >= RATIO_MIN && ratio <= RATIO_MAX) {
            resolve(file);
          } else {
            alert(
              `이미지 비율이 허용 범위를 벗어났습니다.\n\n현재 비율: ${ratio.toFixed(
                2
              )} (가로/세로)\n허용 범위: ${RATIO_MIN} ~ ${RATIO_MAX}\n\n이미지 비율을 조정해주세요.`
            );
            reject(new Error('이미지 비율 범위 초과'));
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(testUrl);
          reject(new Error('이미지 로드 실패'));
        };
        img.src = testUrl;
      }).catch(() => null as unknown as File);

      if (!sizeOk) {
        fileInput.value = '';
        setIsImageProcessing(false);
        return;
      }

      // 이미지 압축 옵션 설정
      const options = {
        maxSizeMB: 1, // 최대 1MB
        maxWidthOrHeight: MAX_DIMENSION,
        useWebWorker: true,
        fileType: file.type as KnownMime,
      };

      // 이미지 압축 실행
      const compressed = await imageCompression(file, options);

      // Blob을 File 객체로 변환 (파일명 유지 시도)
      const finalFile = new File([compressed], file.name, {
        type: compressed.type || file.type,
        lastModified: Date.now(),
      });

      // 미리보기 생성 (dataURL)
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(finalFile);

      // 상태 저장
      setSelectedImage(finalFile);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
      fileInput.value = '';
      // 실패 시 원래 상태 유지(기존 URL 있으면 그대로)
    } finally {
      setIsImageProcessing(false);
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
    setImagePreview('');
    setExistingImageUrl(''); // 기존 이미지 URL도 함께 초기화

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
    clearExistingImageUrl,
  };
};