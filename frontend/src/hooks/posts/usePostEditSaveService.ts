import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { updatePost, validateUrl } from '@/api/post/postEditService';
import type { usePostEditState } from './usePostEditState';

// 게시글 수정 저장 서비스 훅
export const usePostEditSaveService = (
  postId: string,
  state: ReturnType<typeof usePostEditState>
) => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const {
    linkUrl,
    title,
    content,
    tags,
    originalThumbnailUrl,
    selectedImage,
    setUrlError,
    clearErrors,
    setIsLoading
  } = state;

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
        (requestData as any).thumbnailUrl = originalThumbnailUrl;
      }

      const result = await updatePost(postId, requestData, selectedImage || undefined);
      
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
    navigate, clearErrors, setUrlError, state.setTitleError, state.setContentError, setIsLoading
  ]);

  return {
    handleSave,
  };
};
