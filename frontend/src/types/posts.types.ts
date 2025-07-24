// 게시글 관련 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  imageUrl?: string;
  tags?: string[];
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