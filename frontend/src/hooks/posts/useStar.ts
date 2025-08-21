import { useStarState } from './useStarState';
import { useStarActions } from './useStarActions';

// 스타 상태 관리 훅
export const useStar = (postId: string) => {
  const state = useStarState();
  const actions = useStarActions({ postId, state });

  return {
    isStarred: state.isStarred,
    isStarLoading: state.isStarLoading,
    toggleStar: actions.toggleStar
  };
};

