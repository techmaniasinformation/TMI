import { useEffect } from 'react';
import { fetchPopularPosts } from '@/api/post/popularPostsApiService';
import type { usePopularPostsState } from './usePopularPostsState';

interface UsePopularPostsActionsProps {
  size: number;
  state: ReturnType<typeof usePopularPostsState>;
}

// 인기 게시글 액션 핸들러 훅
export const usePopularPostsActions = ({ size, state }: UsePopularPostsActionsProps) => {
  const { setState } = state;

  useEffect(() => {
    const loadPopularPosts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const posts = await fetchPopularPosts(size);
        setState({
          posts,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('❌ Popular posts fetch error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: '인기게시글을 불러오는 중 오류가 발생했습니다.'
        }));
      }
    };

    loadPopularPosts();
  }, [size, setState]);
};
