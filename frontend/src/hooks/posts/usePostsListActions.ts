import { useCallback, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { fetchPostsFromAPI, transformApiPosts } from '@/api/post/postsListApiService';
import type { usePostsListState } from './usePostsListState';

interface UsePostsListActionsProps {
  currentPage: number;
  currentTab: 'latest' | 'following';
  followMemberId: string | null;
  state: ReturnType<typeof usePostsListState>;
}

// 게시글 목록 액션 핸들러 훅
export const usePostsListActions = ({ 
  currentPage, 
  currentTab, 
  followMemberId, 
  state 
}: UsePostsListActionsProps) => {
  const { setState } = state;
  const { user } = useUserStore();
  const isLoggedIn = user !== null && user.memberId > 0;

  // 단순화된 API 호출 함수
  const fetchPosts = useCallback(async () => {
    // 팔로우 탭이고 로그인하지 않았으면 API 호출하지 않음
    if (currentTab === 'following' && (!isLoggedIn || followMemberId === 'guest')) {
      console.log('🔍 팔로우 탭이지만 로그인하지 않음 - API 호출 안함');
      setState(prev => ({ ...prev, posts: [], loading: false, error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 실제 API에서 데이터 가져오기
      const response = await fetchPostsFromAPI({ 
        page: currentPage, 
        size: 10, 
        followMemberId: currentTab === 'following' ? user?.memberId : undefined
      });
      
      const { posts: apiPosts, pageInfo } = response.data;

      // API 응답을 프론트엔드 타입으로 변환
      const transformedPosts = transformApiPosts(apiPosts);

      setState({
        posts: transformedPosts,
        loading: false,
        error: null,
        currentPage: pageInfo?.currPage ?? 1,
        totalPages: pageInfo?.totalPages ?? 1,
        totalElements: pageInfo?.totalElements ?? 0,
        isLast: pageInfo?.isLast ?? false
      });

    } catch (error) {
      console.error('❌ Posts fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '게시글을 불러오는 중 오류가 발생했습니다.'
      }));
    }
  }, [currentPage, currentTab, user?.memberId, isLoggedIn, followMemberId, setState]);

  // 단순화된 useEffect - URL 변경 시에만 API 호출
  useEffect(() => {
    console.log('🔍 URL 변경 감지 - API 호출:', { currentPage, currentTab, isLoggedIn });
    fetchPosts();
  }, [fetchPosts]);

  return {
    fetchPosts,
  };
};
