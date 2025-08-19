import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import { updatePost, validateUrl } from '@/api/post/postEditService';
import { requestAISummary, processAISummaryResult } from '@/api/post/aiSummaryService';
import type { usePostEditState } from './usePostEditState';

// 게시글 수정 액션 훅
export const usePostEditActions = (
  postId: string,
  state: ReturnType<typeof usePostEditState>
) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  // 태그 자동완성 훅 사용
  const tagAutocomplete = useTagAutocomplete();

  const {
    linkUrl,
    title,
    content,
    tags,
    originalThumbnailUrl,
    selectedImage,
    setUrlError,
    setAiError,
    setAISummaryData,
    clearErrors,
    addTag,
    clearNewTag,
    setIsLoading,
    setIsAILoading
  } = state;

  // AI 요약 처리
  const handleAISummary = useCallback(async () => {
    if (!linkUrl) {
      alert('링크 URL을 먼저 입력해주세요.');
      return;
    }

    const urlValidation = validateUrl(linkUrl);
    if (!urlValidation.isValid) {
      setUrlError(urlValidation.error || '올바른 URL을 입력해주세요.');
      return;
    }

    setIsAILoading(true);
    setAiError('');

    try {
      const result = await requestAISummary(urlValidation.processedUrl!);
      const { summary, tags: aiTags, error } = processAISummaryResult(result);
      
      if (error) {
        setAiError(error);
      } else {
        setAISummaryData(summary, aiTags);
        alert('AI 요약이 완료되었습니다!');
      }
    } catch (error) {
      console.error('AI 요약 실패:', error);
      setAiError('AI 요약에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setIsAILoading(false);
    }
  }, [linkUrl, setUrlError, setAiError, setAISummaryData, setIsAILoading]);

  // 저장 처리
  const handleSave = useCallback(async () => {
    clearErrors();
    let hasError = false;

    // 유효성 검사
    if (!linkUrl || !title) {
      if (!linkUrl) state.setUrlError('링크 URL을 입력해주세요.');
      if (!title) state.setTitleError('제목을 입력해주세요.');
      hasError = true;
    }
    if (content.length < 50) {
      state.setContentError('게시글 내용은 50자 이상 입력해주세요.');
      hasError = true;
    }
    if (content.length > 6000) {
      state.setContentError('게시글 내용은 6000자 이하여야 합니다.');
      hasError = true;
    }
    if (hasError) return;

    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const urlValidation = validateUrl(linkUrl);
      if (!urlValidation.isValid) {
        state.setUrlError(urlValidation.error || '올바른 URL을 입력해주세요.');
        return;
      }

      const validatedTags = Array.isArray(tags) 
        ? tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0).slice(0, 5) 
        : [];

      const requestData = {
        memberId: user.memberId,
        link: urlValidation.processedUrl!,
        title: title,
        content: content,
        tags: validatedTags
      };

      // 이미지가 업로드되지 않았거나 변경되지 않았다면 기존 썸네일 URL 포함
      if (!selectedImage && originalThumbnailUrl) {
        requestData.thumbnailUrl = originalThumbnailUrl;
      }

      const result = await updatePost(postId, requestData, selectedImage);
      
      alert('게시글이 수정되었습니다!');
      if (result.data && result.data.postId) {
        navigate(`/post/${result.data.postId}`);
      } else {
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      console.error('수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [
    linkUrl, title, content, tags, user?.memberId, postId, originalThumbnailUrl, selectedImage,
    navigate, clearErrors, setUrlError, setTitleError, setContentError, setIsLoading
  ]);

  // 태그 추가
  const handleAddTag = useCallback((tagName?: string) => {
    const tagToAdd = (tagName || state.newTag).trim();
    if (tagToAdd) {
      const success = addTag(tagToAdd);
      if (success) {
        clearNewTag();
        tagAutocomplete.clearSuggestions();
      }
    }
  }, [state.newTag, addTag, clearNewTag, tagAutocomplete]);

  // 태그 입력 변경
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      state.setNewTag(value);
      state.setTagError('');
      if (value.trim()) {
        tagAutocomplete.searchTags(value.trim());
        state.setShowTagSuggestions(true);
      } else {
        state.setShowTagSuggestions(false);
        tagAutocomplete.clearSuggestions();
      }
    }
  }, [state, tagAutocomplete]);

  // 태그 입력 블러
  const handleTagInputBlur = useCallback(() => {
    setTimeout(() => state.setShowTagSuggestions(false), 200);
  }, [state]);

  // 태그 키 입력
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
    else if (e.key === 'Escape') {
      state.setShowTagSuggestions(false);
      tagAutocomplete.clearSuggestions();
    }
  }, [state, tagAutocomplete]);

  // 취소
  const handleCancel = useCallback(() => {
    navigate(`/post/${postId}`);
  }, [navigate, postId]);

  return {
    // AI 요약
    handleAISummary,
    
    // 저장
    handleSave,
    
    // 태그 관리
    handleAddTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleTagKeyPress,
    
    // 기타
    handleCancel,
    
    // 태그 자동완성
    ...tagAutocomplete
  };
};
