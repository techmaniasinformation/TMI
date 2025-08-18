// 기본 이미지 URL들 (SVG 데이터 URL로 변경)
export const DEFAULT_IMAGES = {
  // 프로필 이미지 (간단한 사용자 아이콘 SVG)
  PROFILE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUI5QkEwIi8+CjxyZWN0IHg9IjMwIiB5PSI2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=',
  // 회사 이미지 (간단한 회사 아이콘 SVG)
  COMPANY: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjM0I4MkY0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QzwvdGV4dD4KPHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db21wYW55PC90ZXh0Pgo8L3N2Zz4K',
  // 게시글 썸네일 (간단한 이미지 아이콘 SVG)
  THUMBNAIL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5QjlCQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K',
  // 뱃지 이미지 (간단한 별 아이콘 SVG)
  BADGE: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPHBhdGggZD0iTTEwIDJMMTIuNDcgNy4yNkwxOC4xMiA3LjI2TDEzLjgyIDExLjc0TDE1LjM1IDE4LjI2TDEwIDE0Ljc0TDQuNjUgMTguMjZNNi4xOCAxMS43NEwxLjg4IDcuMjZMNy41MyA3LjI2TDEwIDJaIiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=',
  // 일반 이미지 (간단한 이미지 아이콘 SVG)
  GENERAL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUI5QkEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD4KPC9zdmc+Cg==',
  // 스켈레톤 이미지 (로딩 상태용 SVG)
  SKELETON: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo='
};

// 이미지 URL이 유효한지 확인하는 함수
export const isValidImageUrl = url => {
  if (!url) return false;
  if (url.trim() === '') return false;
  if (url === 'null' || url === 'undefined') return false;
  // 빈 문자열이나 공백만 있는 경우
  if (url.replace(/\s/g, '') === '') return false;

  // 우리가 만든 기본 이미지는 유효
  if (url.startsWith('data:image/svg+xml')) return true;

  // https://로 시작하는 실제 이미지 URL은 유효
  if (url.startsWith('https://')) {
    // 실제 서버 URL인 경우 유효
    if (url.includes('i13a509.p.ssafy.io')) return true;
    if (url.includes('api/v1/image')) return true;

    // URL이 너무 짧거나 패턴이 이상한 경우만 체크
    if (url.length < 15) return false; // 너무 짧은 URL
    if (url.includes('placeholder') || url.includes('dummy')) return false; // 플레이스홀더 이미지
    if (url.includes('404') || url.includes('error')) return false; // 에러 페이지
    if (url.includes('default') && url.includes('image')) return false; // 기본 이미지 텍스트
  }
  return true;
};

// 안전한 이미지 URL을 반환하는 함수 (메모이제이션을 위해 수정)
export const getSafeImageUrl = (url, defaultImage = DEFAULT_IMAGES.PROFILE) => {
  // 이미 기본 이미지인 경우 그대로 반환
  if (url === defaultImage) return url;

  // 유효하지 않은 URL인 경우 기본 이미지 반환
  if (!isValidImageUrl(url)) return defaultImage;
  return url;
};

// 기존 함수들
export const getSafeProfileUrl = url => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.toLowerCase().includes('default')) {
    return DEFAULT_IMAGES.PROFILE;
  }
  return url;
};
export const getSafeCompanyUrl = url => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return DEFAULT_IMAGES.COMPANY;
  }
  return url;
};
export const getSafeThumbnailUrl = url => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return DEFAULT_IMAGES.THUMBNAIL;
  }
  return url;
};
export const getSafeBadgeUrl = url => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return DEFAULT_IMAGES.BADGE;
  }
  return url;
};

// 새로운 이미지 에러 처리 함수들
export const handleImageError = (event, fallbackType = 'GENERAL') => {
  const img = event.currentTarget;
  img.src = DEFAULT_IMAGES[fallbackType];
  img.onerror = null; // 무한 루프 방지
};
export const handleProfileImageError = event => {
  handleImageError(event, 'PROFILE');
};
export const handleCompanyImageError = event => {
  handleImageError(event, 'COMPANY');
};
export const handleThumbnailImageError = event => {
  handleImageError(event, 'THUMBNAIL');
};
export const handleBadgeImageError = event => {
  handleImageError(event, 'BADGE');
};

// 이미지 로딩 상태 관리를 위한 커스텀 훅용 함수
export const createImageErrorHandler = (fallbackType = 'GENERAL') => {
  return event => {
    handleImageError(event, fallbackType);
  };
};