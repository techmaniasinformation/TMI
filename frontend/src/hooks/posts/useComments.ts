import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { fetchComments } from '@/api/comment/commentService';
import { fetchUserRecommendations } from '@/api/comment/recommendationService';
import { useCommentState } from './useCommentState';
import { useCommentActions } from './useCommentActions';
import type { Comment } from '@/api/comment/commentService';

// 댓글 관리 훅
export const useComments = (postId: string) => {
  const { user } = useUserStore();
  const state = useCommentState();
  const actions = useCommentActions(postId, state);

  // 댓글 목록 가져오기
  const fetchCommentsData = useCallback(async () => {
    if (!postId) return;

    try {
      const { comments, bestCommentId } = await fetchComments(postId);
      state.setCommentsData(comments, bestCommentId);
    } catch (err) {
      console.error('❌ [useComments] 댓글 가져오기 실패:', err);
      state.setCommentsData([], -1);
    }
  }, [postId, state]);

  // 댓글 추천 상태 확인
  const checkUserRecommendations = useCallback(async () => {
    if (!user?.memberId || !postId) return;

    try {
      const recommendations = await fetchUserRecommendations(user.memberId, postId);
      state.setRecommendationsData(recommendations);
    } catch (err) {
      // 에러 무시
    }
  }, [user?.memberId, postId, state]);

  useEffect(() => {
    fetchCommentsData();
    checkUserRecommendations();
  }, [fetchCommentsData, checkUserRecommendations]);

  return {
    // 상태
    comments: state.comments,
    bestCommentId: state.bestCommentId,
    commentText: state.commentText,
    showLinkInput: state.showLinkInput,
    linkUrl: state.linkUrl,
    commentLoading: state.commentLoading,
    userRecommendations: state.userRecommendations,
    recommendLoading: state.recommendLoading,
    deleteLoading: state.deleteLoading,

    // 상태 설정
    setCommentText: state.setCommentText,
    setShowLinkInput: state.setShowLinkInput,
    setLinkUrl: state.setLinkUrl,

    // 액션
    addComment: actions.addComment,
    toggleCommentRecommend: actions.toggleCommentRecommend,
    deleteComment: actions.deleteComment
  };
};

export type { Comment };
