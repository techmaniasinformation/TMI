import { useCallback } from 'react';
import { useTagAutocomplete } from '@/hooks/tags/useTagAutocomplete';
import type { usePostEditState } from './usePostEditState';

// 게시글 수정 태그 서비스 훅
export const usePostEditTagService = (state: ReturnType<typeof usePostEditState>) => {
  // 태그 자동완성 훅 사용
  const tagAutocomplete = useTagAutocomplete();

  const {
    addTag,
    clearNewTag,
  } = state;

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

  return {
    // 태그 관리
    handleAddTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleTagKeyPress,
    
    // 태그 자동완성
    ...tagAutocomplete
  };
};
