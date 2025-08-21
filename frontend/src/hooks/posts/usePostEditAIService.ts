import { useCallback } from 'react';
import { validateUrl } from '@/api/post/postEditService';
import { requestAISummary, processAISummaryResult } from '@/api/post/aiSummaryService';
import type { usePostEditState } from './usePostEditState';

// 게시글 수정 AI 서비스 훅
export const usePostEditAIService = (state: ReturnType<typeof usePostEditState>) => {
  const {
    linkUrl,
    setUrlError,
    setAiError,
    setAISummaryData,
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

  return {
    handleAISummary,
  };
};
