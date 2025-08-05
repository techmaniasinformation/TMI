// 게시글 관련 타입 정의
export interface Post {
  postId: number;
  title: string;
  content: string;
  tags: string[];
  memberProfileUrl: string;
  companyProfileUrl?: string;
  name: string;
  badgeUrl: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  thumbnailUrl: string;
  link: string;
  isStar: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

// 검색 관련 타입들
export interface AppliedFilters {
  q?: string; // 검색 키워드
  techTags?: string[];
  companyTags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchApiResponse {
  data: {
    posts: Post[];
    totalCount?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    pageInfo?: PageInfo;
    appliedFilters?: AppliedFilters;
  };
  status?: string;
}

export interface PageInfo {
  totalElements?: number;
  totalPages?: number;
  isLast?: boolean;
  currPage?: number;
}

export interface PostDetail extends Post {
  comments: Comment[];
  relatedPosts: Post[];
}