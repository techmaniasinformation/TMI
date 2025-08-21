import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostEditAIService } from './usePostEditAIService';
import { usePostEditSaveService } from './usePostEditSaveService';
import { usePostEditTagService } from './usePostEditTagService';
import type { usePostEditState } from './usePostEditState';

// 게시글 수정 액션 훅
export const usePostEditActions = (
  postId: string,
  state: ReturnType<typeof usePostEditState>
) => {
  const navigate = useNavigate();
  
  // 서비스 훅들
  const aiService = usePostEditAIService(state);
  const saveService = usePostEditSaveService(postId, state);
  const tagService = usePostEditTagService(state);

  // 취소
  const handleCancel = useCallback(() => {
    navigate(`/post/${postId}`);
  }, [navigate, postId]);

  return {
    // AI 요약
    handleAISummary: aiService.handleAISummary,
    
    // 저장
    handleSave: saveService.handleSave,
    
    // 태그 관리
    handleAddTag: tagService.handleAddTag,
    handleTagInputChange: tagService.handleTagInputChange,
    handleTagInputBlur: tagService.handleTagInputBlur,
    handleTagKeyPress: tagService.handleTagKeyPress,
    
    // 기타
    handleCancel,
    
    // 태그 자동완성
    suggestions: tagService.suggestions,
    loading: tagService.loading,
    error: tagService.error,
    searchTags: tagService.searchTags,
    clearSuggestions: tagService.clearSuggestions,
    tagSearchResults: tagService.tagSearchResults
  };
};
