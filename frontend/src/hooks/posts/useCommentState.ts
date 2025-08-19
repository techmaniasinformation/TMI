import { useState, useCallback } from 'react';
import type { Comment } from '@/api/comment/commentService';

// 댓글 상태 관리 훅
export const useCommentState = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [bestCommentId, setBestCommentId] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [userRecommendations, setUserRecommendations] = useState<Map<number, number>>(new Map());
  const [recommendLoading, setRecommendLoading] = useState<Map<number, boolean>>(new Map());
  const [deleteLoading, setDeleteLoading] = useState<Map<number, boolean>>(new Map());

  // 댓글 목록 설정
  const setCommentsData = useCallback((comments: Comment[], bestCommentId: number) => {
    setComments(comments);
    setBestCommentId(bestCommentId);
  }, []);

  // 추천 상태 설정
  const setRecommendationsData = useCallback((recommendations: Map<number, number>) => {
    setUserRecommendations(recommendations);
  }, []);

  // 추천 로딩 상태 관리
  const setRecommendLoadingState = useCallback((commentId: number, loading: boolean) => {
    setRecommendLoading(prev => {
      const newMap = new Map(prev);
      if (loading) {
        newMap.set(commentId, true);
      } else {
        newMap.delete(commentId);
      }
      return newMap;
    });
  }, []);

  // 삭제 로딩 상태 관리
  const setDeleteLoadingState = useCallback((commentId: number, loading: boolean) => {
    setDeleteLoading(prev => {
      const newMap = new Map(prev);
      if (loading) {
        newMap.set(commentId, true);
      } else {
        newMap.delete(commentId);
      }
      return newMap;
    });
  }, []);

  // 댓글 추천 수 업데이트
  const updateCommentRecommendCount = useCallback((commentId: number, increment: boolean) => {
    setComments(prev => prev.map(comment => 
      comment.commentId === commentId 
        ? { 
            ...comment, 
            recommendCount: increment 
              ? comment.recommendCount + 1 
              : Math.max(0, comment.recommendCount - 1) 
          }
        : comment
    ));
  }, []);

  // 댓글 삭제
  const removeCommentFromList = useCallback((commentId: number) => {
    setComments(prev => prev.filter(comment => comment.commentId !== commentId));
  }, []);

  // 추천 상태 업데이트
  const updateRecommendationState = useCallback((commentId: number, recommendationId?: number) => {
    setUserRecommendations(prev => {
      const newMap = new Map(prev);
      if (recommendationId) {
        newMap.set(commentId, recommendationId);
      } else {
        newMap.delete(commentId);
      }
      return newMap;
    });
  }, []);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setCommentText('');
    setLinkUrl('');
    setShowLinkInput(false);
  }, []);

  return {
    // 상태
    comments,
    bestCommentId,
    commentText,
    showLinkInput,
    linkUrl,
    commentLoading,
    userRecommendations,
    recommendLoading,
    deleteLoading,

    // 상태 설정
    setCommentText,
    setShowLinkInput,
    setLinkUrl,
    setCommentLoading,
    setCommentsData,
    setRecommendationsData,

    // 상태 관리
    setRecommendLoadingState,
    setDeleteLoadingState,
    updateCommentRecommendCount,
    removeCommentFromList,
    updateRecommendationState,
    resetForm
  };
};

