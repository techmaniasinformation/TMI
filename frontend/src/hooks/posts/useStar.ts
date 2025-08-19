import { useStarState } from '../star/useStarState';
import { useStarEvents } from '../star/useStarEvents';

// 스타 상태 관리 훅
export const useStar = (postId: string) => {
  const state = useStarState();
  const events = useStarEvents({ postId, state });

  return {
    isStarred: state.isStarred,
    isStarLoading: state.isStarLoading,
    toggleStar: events.toggleStar
  };
};

