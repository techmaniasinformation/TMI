// 기본 디폴트 이미지 URL들
export const DEFAULT_IMAGES = {
  // 기본 프로필 이미지 (간단한 SVG)
  PROFILE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUI5QkEwIi8+CjxyZWN0IHg9IjMwIiB5PSI2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=',
  
  // 기본 썸네일 이미지 (간단한 SVG)
  THUMBNAIL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5QjlCQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K',
  
  // 기본 뱃지 이미지 (간단한 SVG)
  BADGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHBhdGggZD0iTTEwIDJMMTIuNDcgNy4yNkwxOC4xMiA3LjI2TDEzLjgyIDExLjc0TDE1LjM1IDE4LjI2TDEwIDE0Ljc0TDQuNjUgMTguMjZNNi4xOCAxMS43NEwxLjg4IDcuMjZMNy41MyA3LjI2TDEwIDJaIiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=',
  
  // 기본 회사 프로필 이미지 (간단한 SVG)
  COMPANY: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjM0I4MkY0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD4KPHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db21wYW55PC90ZXh0Pgo8L3N2Zz4K',
} as const;

// 이미지 URL이 유효한지 확인하는 함수
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  if (url.trim() === '') return false;
  if (url === 'null' || url === 'undefined') return false;
  // 빈 문자열이나 공백만 있는 경우
  if (url.replace(/\s/g, '') === '') return false;
  // 잘못된 URL 패턴들 체크
  if (url.includes('profile') && url.length < 10) return false; // "profile" 같은 짧은 텍스트
  if (url.startsWith('data:image/svg+xml')) return true; // 우리가 만든 기본 이미지는 유효
  // 존재하지 않는 도메인 체크
  if (url.includes('cdn.example.com')) return false; // 예시 도메인
  if (url.includes('example.com')) return false; // 예시 도메인
  
  // https://로 시작하지만 실제로는 이미지가 아닐 수 있는 경우들 체크
  if (url.startsWith('https://')) {
    // URL이 너무 짧거나 패턴이 이상한 경우
    if (url.length < 15) return false; // 너무 짧은 URL
    if (url.includes('placeholder') || url.includes('dummy')) return false; // 플레이스홀더 이미지
    if (url.includes('404') || url.includes('error')) return false; // 에러 페이지
    if (url.includes('default') && url.includes('image')) return false; // 기본 이미지 텍스트
  }
  
  return true;
};

// 안전한 이미지 URL을 반환하는 함수
export const getSafeImageUrl = (
  url: string | null | undefined, 
  defaultImage: string = DEFAULT_IMAGES.PROFILE
): string => {
  return isValidImageUrl(url) ? (url as string) : defaultImage;
};

// 프로필 이미지용 안전한 URL
export const getSafeProfileUrl = (url: string | null | undefined): string => {
  return getSafeImageUrl(url, DEFAULT_IMAGES.PROFILE);
};

// 썸네일 이미지용 안전한 URL
export const getSafeThumbnailUrl = (url: string | null | undefined): string => {
  return getSafeImageUrl(url, DEFAULT_IMAGES.THUMBNAIL);
};

// 뱃지 이미지용 안전한 URL
export const getSafeBadgeUrl = (url: string | null | undefined): string => {
  return getSafeImageUrl(url, DEFAULT_IMAGES.BADGE);
};

// 회사 프로필 이미지용 안전한 URL
export const getSafeCompanyUrl = (url: string | null | undefined): string => {
  return getSafeImageUrl(url, DEFAULT_IMAGES.COMPANY);
};
