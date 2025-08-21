import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { addRecommendation, removeRecommendation } from '@/api/comment/recommendationService';
import type { useCommentState } from './useCommentState';

// 댓글 추천 서비스 훅
export const useCommentRecommendService = (state: ReturnType<typeof useCommentState>) => {
  const { user } = useUserStore();
  const {
    userRecommendations,
    setRecommendLoadingState,
    updateCommentRecommendCount,
    updateRecommendationState
  } = state;

  // 댓글 추천 토글
  const toggleCommentRecommend = useCallback(async (commentId: number) => {
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (state.recommendLoading.get(commentId)) return;

    setRecommendLoadingState(commentId, true);

    try {
      const isCurrentlyRecommended = userRecommendations.has(commentId);

      if (isCurrentlyRecommended) {
        // 추천 취소
        const recommendationId = userRecommendations.get(commentId);
        if (!recommendationId) {
          alert('추천 정보를 찾을 수 없습니다.');
          return;
        }

        await removeRecommendation(recommendationId);
        updateRecommendationState(commentId);
        updateCommentRecommendCount(commentId, false);
        alert('추천을 취소했습니다.');
      } else {
        // 추천 추가
        const recommendationId = await addRecommendation(user.memberId, commentId);
        updateRecommendationState(commentId, recommendationId);
        updateCommentRecommendCount(commentId, true);
        alert('댓글을 추천했습니다.');
      }
    } catch (err) {
      console.error('❌ [useComments] 댓글 추천 요청 실패:', err);
      alert('추천 요청에 실패했습니다.');
    } finally {
      setRecommendLoadingState(commentId, false);
    }
  }, [user, userRecommendations, state.recommendLoading, setRecommendLoadingState, updateRecommendationState, updateCommentRecommendCount]);

  return {
    toggleCommentRecommend,
  };
};
