import { usePostData } from './usePostData';
import { useStar } from './useStar';
import { useFollow } from './useFollow';
import { useComments } from './useComments';

// 통합 훅
export const usePostDetail = (postId: string, companyId?: string) => {
  const { postData, loading, error, refetch } = usePostData(postId);
  const { isStarred, isStarLoading, toggleStar } = useStar(postId);
  const { isFollowing, toggleFollow } = useFollow(postData, companyId);
  const {
    comments,
    bestCommentId,
    commentText,
    setCommentText,
    showLinkInput,
    setShowLinkInput,
    linkUrl,
    setLinkUrl,
    commentLoading,
    userRecommendations,
    recommendLoading,
    deleteLoading,
    addComment,
    toggleCommentRecommend,
    deleteComment
  } = useComments(postId);

  return {
    // 게시글 데이터
    postData,
    loading,
    error,
    refetch,
    
    // 스타 관련
    isStarred,
    isStarLoading,
    toggleStar,
    
    // 팔로우 관련
    isFollowing,
    toggleFollow,
    
    // 댓글 관련
    comments,
    bestCommentId,
    commentText,
    setCommentText,
    showLinkInput,
    setShowLinkInput,
    linkUrl,
    setLinkUrl,
    commentLoading,
    userRecommendations,
    recommendLoading,
    deleteLoading,
    addComment,
    toggleCommentRecommend,
    deleteComment
  };
}; 