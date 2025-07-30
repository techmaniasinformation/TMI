import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ===== CSS 클래스 유틸리티 =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== 날짜 포맷팅 =====
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
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
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// ===== 검색 API 유틸리티 =====
export interface SearchApiParams {
  q?: string;           // 검색어 (keyword)
  techTags?: string;    // 기술 태그 ID들 (쉼표로 구분)
  companyTags?: string; // 회사 태그 ID들 (쉼표로 구분)
  page?: number;        // 페이지 번호
  size?: number;        // 페이지 크기
}

export const buildSearchApiParams = (
  keyword: string,
  techTagNames: string[],
  companyTagNames: string[],
  page: number = 1,
  size: number = 10
): SearchApiParams => {
  const params: SearchApiParams = {
    page,
    size
  };

  // 검색어가 있으면 추가
  if (keyword.trim()) {
    params.q = keyword.trim();
  }

  // 기술 태그 이름을 그대로 전달
  if (techTagNames.length > 0) {
    params.techTags = techTagNames.join(',');
  }

  // 회사 태그 이름을 그대로 전달
  if (companyTagNames.length > 0) {
    params.companyTags = companyTagNames.join(',');
  }

  return params;
};

export const buildSearchQueryString = (params: SearchApiParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const searchPosts = async (params: SearchApiParams) => {
  const queryString = buildSearchQueryString(params);
  const url = `/api/v1/posts?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
}; 