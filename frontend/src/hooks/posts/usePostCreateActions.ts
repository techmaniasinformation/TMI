import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostCreateAIService } from './usePostCreateAIService';
import { usePostCreateSaveService } from './usePostCreateSaveService';
import { usePostCreateTagService } from './usePostCreateTagService';
import type { usePostCreateState } from './usePostCreateState';

// 게시글 생성 액션 훅
export const usePostCreateActions = (
  state: ReturnType<typeof usePostCreateState>
) => {
  const navigate = useNavigate();
  
  // 서비스 훅들
  const aiService = usePostCreateAIService(state);
  const saveService = usePostCreateSaveService(state);
  const tagService = usePostCreateTagService(state);

  // 취소
  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
