import { useState, useCallback } from 'react';

// 게시글 수정 기본 상태 관리 훅
export const usePostEditBasicState = () => {
  // 기본 상태
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
  // 에러 상태
  const [urlError, setUrlError] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setTitleError('');
    setContentError('');
    setUrlError('');
    setAiError('');
  }, []);

  // AI 요약 설정
  const setAISummaryData = useCallback((summary: string, aiTags: string[]) => {
    setAiSummary(summary);
    setContent(summary);
  }, []);

  return {
    // 상태
    linkUrl,
    title,
    content,
    isLoading,
    isAILoading,
    aiSummary,
    urlError,
    aiError,
    titleError,
    contentError,

    // 상태 설정
    setLinkUrl,
    setTitle,
    setContent,
    setIsLoading,
    setIsAILoading,
    setUrlError,
    setAiError,
    setTitleError,
    setContentError,

    // 상태 관리
    clearErrors,
    setAISummaryData,
  };
};
