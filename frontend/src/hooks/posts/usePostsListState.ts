import { useState } from 'react';
import { Post } from '@/types';

// 게시글 목록 상태 관리 훅
export interface PostsListState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLast: boolean;
}

export const usePostsListState = (initialPage: number = 1) => {
  const [state, setState] = useState<PostsListState>({
    posts: [],
    loading: false,
    error: null,
    currentPage: initialPage,
    totalPages: 0,
    totalElements: 0,
    isLast: false
  });

  return {
    // 상태
    ...state,

    // 상태 설정
    setState,
  };
};
