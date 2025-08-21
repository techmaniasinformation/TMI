import { useCallback } from 'react';
import { isValidNickname } from '@/utils/validationUtils';
import type { useProfileEditState } from './useProfileEditState';

interface UseProfileEditSaveProps {
  onSave: (
    nickname: string,
    blogUrl: string,
    githubUrl?: string,
    profileImageUrl?: string | null,
    file?: File | null
  ) => Promise<void>;
}

export function useProfileEditSave(
  state: ReturnType<typeof useProfileEditState>,
  props: UseProfileEditSaveProps
) {
  const { onSave } = props;
  const {
    nickname,
    blogUrl,
    githubUrl,
    selectedImage,
    imagePreview,
    existingImageUrl,
    setSaving
  } = state;

  // 저장
  const handleSubmit = useCallback(async () => {
    if (state.saving) return;
    setSaving(true);
    try {
      const isDelete = !imagePreview && !existingImageUrl && !selectedImage;
      await onSave(
        nickname.trim(),
        blogUrl.trim(),
        githubUrl.trim(),
        isDelete ? null : undefined,
        selectedImage ?? null
      );
    } finally {
      setSaving(false);
    }
  }, [
    state.saving, imagePreview, existingImageUrl, selectedImage,
    nickname, blogUrl, githubUrl, onSave, setSaving
  ]);

  // 유효성 검사
  const isValid = useCallback(() => {
    return (
      !state.saving &&
      !state.nicknameError &&
      isValidNickname((nickname ?? '').trim()) &&
      !state.blogError &&
      !state.githubError &&
      !state.isDuplicated
    );
  }, [state.saving, state.nicknameError, state.blogError, state.githubError, state.isDuplicated, nickname]);

  return {
    handleSubmit,
    isValid,
  };
}
