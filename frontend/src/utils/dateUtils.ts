// UTC 시간을 한국 시간으로 변환하는 유틸리티 함수들

/**
 * 서버 시간(UTC)을 한국 시간으로 변환
 * @param serverDateString - 서버 시간 문자열 (예: "2025-08-12T07:52:32")
 * @returns 한국 시간의 Date 객체
 */
export const convertServerTimeToKST = (serverDateString: string): Date => {
  const utcDate = new Date(serverDateString);
  return new Date(utcDate.getTime() + (9 * 60 * 60 * 1000)); // UTC+9 (한국 시간)
};

/**
 * UTC 시간을 한국 시간으로 포맷팅
 * @param utcDateString - UTC 시간 문자열
 * @returns 한국 시간으로 포맷팅된 문자열
 */
export const formatUTCToKST = (utcDateString: string): string => {
  const kstDate = convertServerTimeToKST(utcDateString);
  return kstDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul'
  });
};

/**
 * UTC 시간을 한국 시간으로 간단히 포맷팅 (날짜만)
 * @param utcDateString - UTC 시간 문자열
 * @returns 한국 시간으로 포맷팅된 날짜 문자열
 */
export const formatUTCToKSTDate = (utcDateString: string): string => {
  const kstDate = convertServerTimeToKST(utcDateString);
  return kstDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  });
};

/**
 * UTC 시간을 상대적 시간으로 표시 (예: "3시간 전", "2일 전")
 * @param utcDateString - UTC 시간 문자열
 * @returns 상대적 시간 문자열
 */
export const getRelativeTime = (utcDateString: string): string => {
  const kstDate = convertServerTimeToKST(utcDateString);
  const now = new Date();
  const diffInMs = now.getTime() - kstDate.getTime();
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return formatUTCToKSTDate(utcDateString);
  }
};
