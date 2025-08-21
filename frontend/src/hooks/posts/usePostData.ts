import { usePostDataState } from './usePostDataState';
import { usePostDataActions } from './usePostDataActions';
import type { PostDetail } from '@/api/post/postApiService';

// 게시글 데이터 관리 훅
export const usePostData = (postId: string) => {
  const state = usePostDataState();
  const actions = usePostDataActions({ postId, state });

  return {
    postData: state.postData,
    loading: state.loading,
    error: state.error,
    refetch: actions.fetchPostDetailAction
  };
};

export type { PostDetail };

