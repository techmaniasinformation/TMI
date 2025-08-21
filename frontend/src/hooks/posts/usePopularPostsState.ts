import { useState } from 'react';
import { Post } from '@/types';

// 인기 게시글 상태 관리 훅
export interface PopularPostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const usePopularPostsState = () => {
  const [state, setState] = useState<PopularPostsState>({
    posts: [],
    loading: false,
    error: null
  });

  return {
    // 상태
    ...state,

    // 상태 설정
    setState,
  };
};
