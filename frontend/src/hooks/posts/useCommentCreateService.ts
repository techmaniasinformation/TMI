import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { createComment } from '@/api/comment/commentService';
import { validateAndProcessUrl } from '@/utils/urlValidation';
import type { useCommentState } from './useCommentState';

// 댓글 생성 서비스 훅
export const useCommentCreateService = (
  postId: string,
  state: ReturnType<typeof useCommentState>
) => {
  const { user } = useUserStore();
  const {
    commentText,
    linkUrl,
    setCommentLoading,
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

  return {
    addComment,
  };
};
