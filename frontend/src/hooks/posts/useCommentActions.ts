import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { createComment, removeComment } from '@/api/comment/commentService';
import { addRecommendation, removeRecommendation } from '@/api/comment/recommendationService';
import { validateAndProcessUrl } from '@/utils/urlValidation';
import type { useCommentState } from './useCommentState';

// 댓글 액션 훅
export const useCommentActions = (
  postId: string,
  state: ReturnType<typeof useCommentState>
) => {
  const { user } = useUserStore();
  const {
    commentText,
    linkUrl,
    userRecommendations,
    setCommentLoading,
    setRecommendLoadingState,
    setDeleteLoadingState,
    updateCommentRecommendCount,
    removeCommentFromList,
    updateRecommendationState,
    resetForm
  } = state;

  // 댓글 추가
  const addComment = useCallback(async () => {
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // URL 검증
    if (linkUrl.trim()) {
      const urlValidation = validateAndProcessUrl(linkUrl);
      if (!urlValidation.isValid) {
        alert(urlValidation.error);
        return;
      }
    }

    setCommentLoading(true);
    try {
      await createComment(postId, user.memberId, commentText, linkUrl);
      resetForm();
      alert('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  }, [commentText, postId, user, linkUrl, setCommentLoading, resetForm]);

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

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId: number) => {
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (state.deleteLoading.get(commentId)) return;

    setDeleteLoadingState(commentId, true);

    try {
      await removeComment(commentId);
      removeCommentFromList(commentId);
      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('❌ [useComments] 댓글 삭제 요청 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    } finally {
      setDeleteLoadingState(commentId, false);
    }
  }, [user, state.deleteLoading, setDeleteLoadingState, removeCommentFromList]);

  return {
    addComment,
    toggleCommentRecommend,
    deleteComment
  };
};

