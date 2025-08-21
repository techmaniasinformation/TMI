import { usePopularPostsState } from './usePopularPostsState';
import { usePopularPostsActions } from './usePopularPostsActions';
import { usePopularPostsUtils } from './usePopularPostsUtils';

export const usePopularPosts = (size: number = 3) => {
  const state = usePopularPostsState();
  const utils = usePopularPostsUtils();
  
  usePopularPostsActions({ size, state });

  return {
    ...state,
    formatNumber: utils.formatNumber
  };
}; 