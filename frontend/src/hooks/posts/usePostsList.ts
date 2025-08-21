import { usePostsListState } from './usePostsListState';
import { usePostsListActions } from './usePostsListActions';
import { usePostsListUI } from './usePostsListUI';

// 게시글 목록 관리 훅
export const usePostsList = () => {
  const ui = usePostsListUI();
  const state = usePostsListState(ui.currentPage);
  const actions = usePostsListActions({
    currentPage: ui.currentPage,
    currentTab: (ui.currentTab || 'latest') as 'latest' | 'following',
    followMemberId: ui.followMemberId,
    state,
  });

  return {
    // 상태
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalElements: state.totalElements,
    isLast: state.isLast,
    
    // UI 관련
    currentTab: ui.currentTab,
    setActiveTab: ui.setActiveTab,
    setCurrentPage: ui.setCurrentPage,
    formatDate: ui.formatDate,
    formatNumber: ui.formatNumber,
    isLoggedIn: ui.isLoggedIn,
  };
}; 