/**
 * 빈 Props 인터페이스 - 페이지 컴포넌트에서 사용
 */
export interface EmptyProps {}

/**
 * 기본 컴포넌트 Props 인터페이스
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 페이지 Props 인터페이스
 */
export interface PageProps extends BaseComponentProps {}

/**
 * 기본 데이터 인터페이스
 */
export interface BaseData {
  id: string | number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 사용자 인터페이스
 */
export interface User extends BaseData {
  nickname: string;
  email: string;
  profileImage?: string;
  bio?: string;
  isVerified?: boolean;
}

/**
 * 게시글 인터페이스
 */
export interface Post extends BaseData {
  postId: number;
  title: string;
  content: string;
  name: string;
  memberProfileUrl?: string;
  companyProfileUrl?: string;
  badgeUrl?: string;
  tags: string[];
  thumbnailUrl?: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  isStarred?: boolean;
  isLiked?: boolean;
}

/**
 * 댓글 인터페이스
 */
export interface Comment extends BaseData {
  content: string;
  author: User;
  postId: string | number;
  likeCount: number;
  isLiked?: boolean;
}

/**
 * 알림 인터페이스
 */
export interface Notification extends BaseData {
  type: 'badge' | 'comment' | 'post' | 'follow';
  message: string;
  isRead: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  postId?: string;
  badgeType?: string;
}

/**
 * 적용된 필터 인터페이스
 */
export interface AppliedFilters {
  q?: string;
  techTags?: string[];
  companyTags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 페이지 정보 인터페이스
 */
export interface PageInfo {
  currentPage: number;
  currPage: number;
  totalPages: number;
  totalItems: number;
  totalElements: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLast: boolean;
}

/**
 * 검색 API 응답 인터페이스
 */
export interface SearchApiResponse {
  data: {
    posts: Post[];
    pageInfo: PageInfo;
    appliedFilters?: AppliedFilters;
  };
  status?: string;
} 