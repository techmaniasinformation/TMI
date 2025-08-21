import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostEditBasicState } from './usePostEditBasicState';
import { usePostEditTagState } from './usePostEditTagState';
import { usePostEditUIState } from './usePostEditUIState';

// 게시글 수정 상태 관리 훅
export const usePostEditState = (postId?: string) => {
  const location = useLocation();
  
  // 상태 관리 훅들
  const basicState = usePostEditBasicState();
  const tagState = usePostEditTagState();
  const uiState = usePostEditUIState(postId);

  // 기존 게시글 데이터 로드
  useEffect(() => {
    const postData = location.state?.postData;
    if (postData) {
      basicState.setTitle(postData.title || '');
      basicState.setContent(postData.content || '');
      tagState.setTags(postData.tags || []);
      basicState.setLinkUrl(postData.link || '');
    } else {
      console.warn('Post data not found in location state.');
    }
  }, [location.state, postId, basicState, tagState]);

  // 통합된 에러 초기화
  const clearErrors = () => {
    basicState.clearErrors();
    tagState.setTagError('');
  };

  // 통합된 AI 요약 설정
  const setAISummaryData = (summary: string, aiTags: string[]) => {
    basicState.setAISummaryData(summary, aiTags);
    tagState.setTagsFromAI(aiTags);
  };

  return {
    // 기본 상태
    ...basicState,
    
    // 태그 상태
    ...tagState,
    
    // UI 상태
    ...uiState,

    // 통합된 상태 관리
    clearErrors,
    setAISummaryData,
  };
};
