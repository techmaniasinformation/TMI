import imageCompression from 'browser-image-compression';

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

/**
 * 앞 N바이트 읽기
 */
export const readBytes = (file: File, n: number): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(new Uint8Array(e.target?.result as ArrayBuffer));
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsArrayBuffer(file.slice(0, n));
  });

/**
 * 매직바이트로 실제 MIME 판별 (PNG/JPEG/GIF)
 */
export const detectActualType = async (file: File): Promise<KnownMime | null> => {
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
 * 이미지 디코드 테스트 (createImageBitmap -> Image() 폴백)
 */
export const canDecodeImage = async (file: File): Promise<boolean> => {
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
 * 파일 크기 검증
 */
export const validateFileSize = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: `파일 크기는 10MB 이하여야 합니다.\n\n현재 파일 크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB\n허용 최대 크기: 10MB`
    };
  }
  
  if (file.size === 0) {
    return {
      isValid: false,
      error: `빈 파일은 업로드할 수 없습니다.\n\n파일명: ${file.name}`
    };
  }
  
  if (file.size < MIN_SIZE) {
    return {
      isValid: false,
      error: `파일 크기가 너무 작습니다.\n\n파일명: ${file.name}\n파일 크기: ${file.size} bytes\n\n유효한 이미지 파일인지 확인해주세요.`
    };
  }
  
  if (file.size < POST_MIN_SIZE) {
    return {
      isValid: false,
      error: `파일이 너무 작습니다. 유효한 이미지 파일이 아닐 수 있습니다.\n\n파일명: ${file.name}\n파일 크기: ${file.size} bytes`
    };
  }
  
  return { isValid: true };
};

/**
 * 파일 형식 검증
 */
export const validateFileType = (file: File): { isValid: boolean; error?: string } => {
  const fileName = file.name.toLowerCase();
  const ext = fileName.split('.').pop() || '';
  const extMime = EXT_TO_MIME[ext];
  
  if (!ALLOWED_TYPES.includes(file.type as KnownMime) || !extMime || extMime !== file.type) {
    return {
      isValid: false,
      error: `jpg, jpeg, png, gif 형식만 업로드할 수 있습니다.\n\n파일명: ${file.name}\n확장자: .${ext}\n감지된 형식: ${file.type || '(알 수 없음)'}`
    };
  }
  
  return { isValid: true };
};

/**
 * 이미지 비율 검증
 */
export const validateImageRatio = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const testUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      const ratio = img.width / img.height;
      URL.revokeObjectURL(testUrl);
      
      if (ratio >= RATIO_MIN && ratio <= RATIO_MAX) {
        resolve({ isValid: true });
      } else {
        resolve({
          isValid: false,
          error: `이미지 비율이 허용 범위를 벗어났습니다.\n\n현재 비율: ${ratio.toFixed(2)} (가로/세로)\n허용 범위: ${RATIO_MIN} ~ ${RATIO_MAX}\n\n이미지 비율을 조정해주세요.`
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(testUrl);
      resolve({
        isValid: false,
        error: '이미지 로드 실패'
      });
    };
    
    img.src = testUrl;
  });
};

/**
 * 이미지 압축
 */
export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, // 최대 1MB
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    fileType: file.type as KnownMime,
  };

  const compressed = await imageCompression(file, options);

  // Blob을 File 객체로 변환 (파일명 유지 시도)
  return new File([compressed], file.name, {
    type: compressed.type || file.type,
    lastModified: Date.now(),
  });
};

/**
 * 파일을 base64로 변환
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });
};

export { ALLOWED_TYPES, EXT_TO_MIME, MAX_SIZE, MIN_SIZE, POST_MIN_SIZE, MAX_DIMENSION, RATIO_MIN, RATIO_MAX };
export type { KnownMime };

