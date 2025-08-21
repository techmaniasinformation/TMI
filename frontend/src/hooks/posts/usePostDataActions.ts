import { useCallback, useEffect } from 'react';
import { fetchPostDetail } from '@/api/post/postApiService';
import type { usePostDataState } from './usePostDataState';

interface UsePostDataActionsProps {
  postId: string;
  state: ReturnType<typeof usePostDataState>;
}

// 게시글 데이터 액션 핸들러 훅
export const usePostDataActions = ({ postId, state }: UsePostDataActionsProps) => {
  const { setPostData, setLoading, setError } = state;

  const fetchPostDetailAction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPostDetail(postId);
      setPostData(data);
    } catch (err) {
      console.error('❌ [usePostData] 게시글 상세 정보 가져오기 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId, setPostData, setLoading, setError]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchPostDetailAction();
  }, [fetchPostDetailAction]);

  return {
    fetchPostDetailAction,
  };
};
