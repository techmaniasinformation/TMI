// 배지 관련 에러 처리
export class BadgeError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'BadgeError';
  }
}

// HTTP 상태코드별 에러 메시지 매핑
const ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
  401: '권한이 없습니다. 로그인 상태를 확인해주세요.',
  403: '권한이 없습니다. 로그인 상태를 확인해주세요.',
  404: '배지를 찾을 수 없습니다.',
  409: '이미 설정된 배지입니다.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
};

// 에러 메시지 생성
export function createBadgeError(
  statusCode: number, 
  serverMessage?: string, 
  fallbackMessage?: string
): BadgeError {
  const baseMessage = ERROR_MESSAGES[statusCode] || fallbackMessage || '배지 요청 처리 중 오류가 발생했습니다.';
  
  let finalMessage = baseMessage;
  if (serverMessage && typeof serverMessage === 'string') {
    finalMessage = `${baseMessage}\n(${serverMessage})`;
  }
  
  return new BadgeError(finalMessage, statusCode);
}

// 일반 에러를 BadgeError로 변환
export function handleBadgeError(error: any, fallbackMessage?: string): BadgeError {
  if (error instanceof BadgeError) {
    return error;
  }
  
  // HTTP 에러인 경우
  if (error.message && error.message.includes('HTTP')) {
    const match = error.message.match(/HTTP (\d+):/);
    if (match) {
      const statusCode = parseInt(match[1]);
      return createBadgeError(statusCode, error.message, fallbackMessage);
    }
  }
  
  // 기타 에러
  return new BadgeError(
    fallbackMessage || '배지 요청 처리 중 오류가 발생했습니다.',
    0,
    error
  );
}
