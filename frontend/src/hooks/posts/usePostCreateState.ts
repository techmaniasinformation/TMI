import { useState, useCallback } from 'react';
import { useImageCompression } from '@/hooks/useImageCompression';

// 게시글 생성 상태 관리 훅
export const usePostCreateState = () => {
  // 이미지 압축 커스텀 훅 사용
  const imageCompression = useImageCompression();

  // 기본 상태
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
  // 에러 상태
  const [urlError, setUrlError] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');
  
  // 태그 관련 상태
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagError, setTagError] = useState('');
  
  // UI 상태
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setTitleError('');
    setContentError('');
    setUrlError('');
    setAiError('');
    setTagError('');
  }, []);

  // 태그 관리
  const addTag = useCallback((tagName: string) => {
    const tagToAdd = tagName.trim();
    if (tagToAdd) {
      if (tags.includes(tagToAdd)) {
        setTagError('중복된 태그입니다.');
        return false;
      }
      if (tags.length >= 5) {
        setTagError('태그는 최대 5개까지 추가할 수 있습니다.');
        return false;
      }
      if (tagToAdd.length > 20) {
        setTagError('태그는 20자 이하여야 합니다.');
        return false;
      }
      setTagError('');
      setTags([...tags, tagToAdd]);
      return true;
    }
    return false;
  }, [tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  const clearNewTag = useCallback(() => {
    setNewTag('');
    setShowTagSuggestions(false);
  }, []);

  // AI 요약 설정
  const setAISummaryData = useCallback((summary: string, aiTags: string[]) => {
    setAiSummary(summary);
    setContent(summary);
    setTags(aiTags);
  }, []);

  // 미리보기 토글
  const togglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  return {
    // 상태
    linkUrl,
    title,
    content,
    tags,
    isLoading,
    isAILoading,
    aiSummary,
    urlError,
    aiError,
    titleError,
    contentError,
    newTag,
    showTagSuggestions,
    tagError,
    isPreviewMode,

    // 상태 설정
    setLinkUrl,
    setTitle,
    setContent,
    setNewTag,
    setShowTagSuggestions,
    setIsLoading,
    setIsAILoading,
    setUrlError,
    setAiError,
    setTitleError,
    setContentError,
    setTagError,

    // 상태 관리
    clearErrors,
    addTag,
    removeTag,
    clearNewTag,
    setAISummaryData,
    togglePreview,

    // 이미지 압축
    ...imageCompression
  };
};
