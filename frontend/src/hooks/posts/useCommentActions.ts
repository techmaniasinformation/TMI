import { useCommentCreateService } from './useCommentCreateService';
import { useCommentRecommendService } from './useCommentRecommendService';
import { useCommentDeleteService } from './useCommentDeleteService';
import type { useCommentState } from './useCommentState';

// 댓글 액션 훅
export const useCommentActions = (
  postId: string,
  state: ReturnType<typeof useCommentState>
) => {
  // 서비스 훅들
  const createService = useCommentCreateService(postId, state);
  const recommendService = useCommentRecommendService(state);
  const deleteService = useCommentDeleteService(state);

  return {
    addComment: createService.addComment,
    toggleCommentRecommend: recommendService.toggleCommentRecommend,
    deleteComment: deleteService.deleteComment
  };
};

