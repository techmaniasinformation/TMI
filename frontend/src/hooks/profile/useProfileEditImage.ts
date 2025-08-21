import { useCallback } from 'react';
import type { useProfileEditState } from './useProfileEditState';

export function useProfileEditImage(
  state: ReturnType<typeof useProfileEditState>
) {
  // 이미지 제거
  const handleImageRemove = useCallback(() => {
    state.setImagePreview('');
    state.setExistingImageUrl('');
    state.setSelectedImage(null);
    const input = document.getElementById('image-upload') as HTMLInputElement | null;
    if (input) input.value = '';
  }, [state]);

  return {
    handleImageRemove,
  };
}
