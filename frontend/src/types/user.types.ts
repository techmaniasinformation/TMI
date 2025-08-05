// 사용자 관련 타입 정의
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  provider: 'google' | 'kakao' | 'naver';
  postsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface UserStats {
  postsCount: number;
  likesCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
}