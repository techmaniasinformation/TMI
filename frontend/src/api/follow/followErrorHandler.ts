// 팔로우 관련 에러 처리
export class FollowError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'FollowError';
  }
}

// HTTP 상태코드별 에러 메시지 매핑
const ERROR_MESSAGES: Record<number, string> = {
  400: '자기 자신을 팔로우 할 수 없습니다.',
  401: '권한이 없습니다. 로그인 상태를 확인해주세요.',
  403: '권한이 없습니다. 로그인 상태를 확인해주세요.',
  404: '대상을 찾을 수 없습니다. 이미 해제되었을 수 있어요.',
  409: '이미 처리된 요청입니다. (중복 팔로우/언팔로우)',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
};

// 에러 메시지 생성
export function createFollowError(
  statusCode: number, 
  serverMessage?: string, 
  fallbackMessage?: string
): FollowError {
  const baseMessage = ERROR_MESSAGES[statusCode] || fallbackMessage || '팔로우 요청 처리 중 오류가 발생했습니다.';
  
  let finalMessage = baseMessage;
  if (serverMessage && typeof serverMessage === 'string') {
    finalMessage = `${baseMessage}\n(${serverMessage})`;
  }
  
  return new FollowError(finalMessage, statusCode);
}

// 일반 에러를 FollowError로 변환
export function handleFollowError(error: any, fallbackMessage?: string): FollowError {
  if (error instanceof FollowError) {
    return error;
  }
  
  // HTTP 에러인 경우
  if (error.message && error.message.includes('HTTP')) {
    const match = error.message.match(/HTTP (\d+):/);
    if (match) {
      const statusCode = parseInt(match[1]);
      return createFollowError(statusCode, error.message, fallbackMessage);
    }
  }
  
  // 기타 에러
  return new FollowError(
    fallbackMessage || '팔로우 요청 처리 중 오류가 발생했습니다.',
    0,
    error
  );
}

