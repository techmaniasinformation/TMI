import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { removeComment } from '@/api/comment/commentService';
import type { useCommentState } from './useCommentState';

// 댓글 삭제 서비스 훅
export const useCommentDeleteService = (state: ReturnType<typeof useCommentState>) => {
  const { user } = useUserStore();
  const {
    setDeleteLoadingState,
    removeCommentFromList
  } = state;

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
    deleteComment,
  };
};
