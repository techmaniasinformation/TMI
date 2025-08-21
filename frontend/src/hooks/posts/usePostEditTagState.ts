import { useState, useCallback } from 'react';

// 게시글 수정 태그 상태 관리 훅
export const usePostEditTagState = () => {
  // 태그 관련 상태
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagError, setTagError] = useState('');

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

  const setTagsFromAI = useCallback((aiTags: string[]) => {
    setTags(aiTags);
  }, []);

  return {
    // 상태
    tags,
    newTag,
    showTagSuggestions,
    tagError,

    // 상태 설정
    setTags,
    setNewTag,
    setShowTagSuggestions,
    setTagError,

    // 상태 관리
    addTag,
    removeTag,
    clearNewTag,
    setTagsFromAI,
  };
};
