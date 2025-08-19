import { useCallback, useEffect, useRef } from 'react';
import { isValidNickname, validateBlogUrl, validateGithubUrl } from '@/utils/validationUtils';
import { checkNicknameDuplicate } from '@/api/profile/profileEditService';
import type { useProfileEditState } from './useProfileEditState';

interface UseProfileEditActionsProps {
  initialNickname: string;
  nicknameDisabled?: boolean;
  onSave: (
    nickname: string,
    blogUrl: string,
    githubUrl?: string,
    profileImageUrl?: string | null,
    file?: File | null
  ) => Promise<void>;
}

// 프로필 수정 액션 훅
export const useProfileEditActions = (
  state: ReturnType<typeof useProfileEditState>,
  props: UseProfileEditActionsProps
) => {
  const { initialNickname, nicknameDisabled, onSave } = props;
  const {
    nickname,
    blogUrl,
    githubUrl,
    selectedImage,
    imagePreview,
    existingImageUrl,
    setNicknameError,
    setDuplicateStatus,
    setSaving
  } = state;

  // 닉네임 중복 검사 관련 refs
  const dupAbortRef = useRef<AbortController | null>(null);
  const dupTimerRef = useRef<number | null>(null);

  // 닉네임 변경
  const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    state.setNickname(next);
    if (!isValidNickname(next)) {
      state.setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      state.setNicknameError(null);
    }
  }, [state]);

  const handleNicknameBlur = useCallback(() => {
    const v = (nickname ?? '').trim();
    state.setNickname(v);
    if (!isValidNickname(v)) {
      state.setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else if (state.isDuplicated) {
      state.setNicknameError('이미 사용 중인 닉네임입니다.');
    } else {
      state.setNicknameError(null);
    }
  }, [nickname, state]);

  // 닉네임 중복 검사 (디바운스 + AbortController)
  useEffect(() => {
    const value = (nickname ?? '').trim();

    // 타이머/요청 정리
    if (dupTimerRef.current) {
      clearTimeout(dupTimerRef.current);
      dupTimerRef.current = null;
    }
    dupAbortRef.current?.abort();

    // 검사 필요 조건: 유효 형식 통과 + 기존 닉네임과 다를 때 + 수정 가능할 때
    if (!nicknameDisabled && isValidNickname(value) && value !== (initialNickname ?? '')) {
      setDuplicateStatus(true, false);

      dupTimerRef.current = window.setTimeout(async () => {
        const controller = new AbortController();
        dupAbortRef.current = controller;
        try {
          const duplicated = await checkNicknameDuplicate(value, controller.signal);
          setDuplicateStatus(false, duplicated);
          
          if (duplicated) {
            setNicknameError('이미 사용 중인 닉네임입니다.');
          }
        } catch {
          // 에러 무시 (중단된 요청)
        } finally {
          dupAbortRef.current = null;
        }
      }, 400);
    } else {
      setDuplicateStatus(false, false);
      if (state.nicknameError === '이미 사용 중인 닉네임입니다.') {
        setNicknameError(null);
      }
    }

    return () => {
      if (dupTimerRef.current) {
        clearTimeout(dupTimerRef.current);
        dupTimerRef.current = null;
      }
      dupAbortRef.current?.abort();
    };
  }, [nickname, initialNickname, nicknameDisabled, setDuplicateStatus, setNicknameError, state.nicknameError]);

  // 블로그/GitHub URL
  const onBlogChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    state.setBlogUrl(e.target.value);
    if (state.blogError) state.setBlogError('');
  }, [state]);

  const onGithubChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    state.setGithubUrl(e.target.value);
    if (state.githubError) state.setGithubError('');
  }, [state]);

  const onBlogBlur = useCallback(() => {
    const r = validateBlogUrl(blogUrl);
    if (!r.ok) state.setBlogError(r.msg!);
    else {
      state.setBlogError('');
      state.setBlogUrl(r.value || '');
    }
  }, [blogUrl, state]);

  const onGithubBlur = useCallback(() => {
    const r = validateGithubUrl(githubUrl);
    if (!r.ok) state.setGithubError(r.msg!);
    else {
      state.setGithubError('');
      state.setGithubUrl(r.value || '');
    }
  }, [githubUrl, state]);

  // 이미지 제거
  const handleImageRemove = useCallback(() => {
    state.setImagePreview('');
    state.setExistingImageUrl('');
    state.setSelectedImage(null);
    const input = document.getElementById('image-upload') as HTMLInputElement | null;
    if (input) input.value = '';
  }, [state]);

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
    // 이벤트 핸들러
    handleNicknameChange,
    handleNicknameBlur,
    onBlogChange,
    onGithubChange,
    onBlogBlur,
    onGithubBlur,
    handleImageRemove,
    handleSubmit,

    // 유틸리티
    isValid,
  };
};
