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
  title: string;
  content: string;
  author: User;
  tags: string[];
  thumbnail?: string;
  url?: string;
  viewCount: number;
  likeCount: number;
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