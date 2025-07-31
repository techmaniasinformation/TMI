// ===== 기본 타입들 =====
export interface EmptyProps {}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends BaseComponentProps {}

export interface BaseData {
  id: string | number;
  createdAt: string;
  updatedAt?: string;
}

// ===== 사용자 타입 =====
export interface User extends BaseData {
  nickname: string;
  email: string;
  profileImage?: string;
  bio?: string;
  isVerified?: boolean;
}

// ===== 게시글 타입 (검색 API용) =====
export interface Post {
  postId: number;
  memberProfileUrl: string;
  companyProfileUrl: string | null;
  name: string;
  badgeUrl: string;
  title: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
}

// ===== 게시글 상세 타입 =====
export interface PostDetail extends Post {
  content: string;
  link: string;
  isStar: boolean;
  bestCommentId: number;
  comments: Comment[];
}

// ===== 댓글 타입 =====
export interface Comment {
  commentId: number;
  memberProfileUrl: string;
  name: string;
  badgeUrl: string;
  comment: string;
  link: string;
  createAt: string;
  isRecommend: boolean;
  recommendCount: number;
}

// ===== 댓글 타입 =====
export interface Comment extends BaseData {
  content: string;
  author: User;
  postId: string | number;
  likeCount: number;
  isLiked?: boolean;
}

// ===== 알림 타입 =====
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

// ===== 검색 관련 타입 =====
export interface SearchApiResponse {
  status: string;
  data: {
    posts: Post[];
    pageInfo: PageInfo;
    appliedFilters?: AppliedFilters;
  };
}

export interface PageInfo {
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  currPage: number;
}

export interface AppliedFilters {
  q?: string;
  techTags?: string[];
  companyTags?: string[];
}

// ===== API 요청 타입 =====
export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}