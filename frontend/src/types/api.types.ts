// API 관련 타입 정의

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  size: number;
}

// 검색 파라미터
export interface SearchParams extends PaginationParams {
  keyword: string;
  techTags?: string[];
  companyTags?: string[];
  filters?: Record<string, any>;
}

// 태그 검색 응답
export interface TagSearchResponse {
  status: string;
  data: {
    techTags: TechTag[];
    companyTags: CompanyTag[];
  };
}

// 기술 태그
export interface TechTag {
  techTagId: number;
  techName: string;
}

// 회사 태그
export interface CompanyTag {
  companyTagId: number;
  companyName: string;
}

// 검색 API 응답
export interface SearchApiResponse {
  status: string;
  data: {
    posts: SearchApiPost[];
    pageInfo: {
      totalElements: number;
      totalPages: number;
      currPage: number;
    };
    appliedFilters?: {
      q?: string;
      techTags?: string[];
      companyTags?: string[];
    };
  };
}

// 검색 API 포스트
export interface SearchApiPost {
  postId: number;
  memberProfileUrl: string;
  companyProfileUrl: string | null;
  name: string;
  badgeUrl: string | null;
  title: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
}

