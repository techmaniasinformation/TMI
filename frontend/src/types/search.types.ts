// 검색 관련 타입 정의

// 검색 조건 인터페이스
export interface SearchCondition {
  keyword: string;
  techTags: string[];
  companyTags: string[];
  currentPage: number;
}

// 검색 결과 인터페이스
export interface SearchResult {
  posts: any[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
}

// 검색 필터 인터페이스
export interface SearchFilter {
  keyword?: string;
  techTags?: string[];
  companyTags?: string[];
  sortBy?: 'latest' | 'popular' | 'relevant';
}

export interface Post {
  id: number;
  title: string;
  author: string;
  authorProfile: string;
  authorBadge?: string;
  tags: string[];
  date: string;
  views: number;
  stars: number;
  comments: number; // commentCount 추가
  thumbnail: string;
  isFollowing?: boolean;
} 