import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import type { PostDetail } from './usePostData';
import { useFollowState } from '../follow/useFollowState';
import { useFollowActions } from '../follow/useFollowActions';

// 팔로우 상태 관리 훅
export const useFollow = (postData: PostDetail | null, companyId?: string) => {
  const { user } = useUserStore();
  const state = useFollowState(postData, companyId);
  const actions = useFollowActions(postData, companyId, state);

  // user 상태가 로드된 후에 팔로우 상태 확인
  useEffect(() => {
    if (user && postData) {
      state.checkFollowStatus();
    }
  }, [user, postData, state.checkFollowStatus]);

  return {
    isFollowing: state.isFollowing,
    toggleFollow: actions.toggleFollow
  };
};

