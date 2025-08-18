import { useState, useEffect, useRef } from 'react';
import { isValidNickname, validateBlogUrl, validateGithubUrl } from '@/utils/validationUtils';
import { useImageCompression } from '@/hooks/useImageCompression';

// 닉네임 중복 확인 API
const DUP_API = 'https://i13a509.p.ssafy.io/api/v1/member/duplicate?nickname=';

interface UseProfileEditProps {
  initialNickname: string;
  initialBlogUrl: string;
  initialGithubUrl?: string;
  initialProfileImageUrl?: string;
  nicknameDisabled?: boolean;
  nicknameHelperText?: string;
  onSave: (
    nickname: string,
    blogUrl: string,
    githubUrl?: string,
    profileImageUrl?: string | null,
    file?: File | null
  ) => Promise<void>;
}

export const useProfileEdit = ({
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
  nicknameDisabled,
  onSave,
}: UseProfileEditProps) => {
  const {
    selectedImage,
    imagePreview,
    existingImageUrl,
    handleImageUpload,
    setImagePreview,
    setExistingImageUrl,
    setSelectedImage,
  } = useImageCompression();

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [blogUrl, setBlogUrl] = useState(initialBlogUrl || '');
  const [blogError, setBlogError] = useState('');
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl || '');
  const [githubError, setGithubError] = useState('');

  const [saving, setSaving] = useState(false);

  // 닉네임 중복 검사 상태
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const dupAbortRef = useRef<AbortController | null>(null);
  const dupTimerRef = useRef<number | null>(null);

  // 초기화
  const initializeForm = () => {
    setNickname(initialNickname);
    setBlogUrl(initialBlogUrl || '');
    setGithubUrl(initialGithubUrl || '');
    setImagePreview('');
    setExistingImageUrl(initialProfileImageUrl || '');
    setSelectedImage(null);
    setNicknameError(null);
    setBlogError('');
    setGithubError('');
    setIsDuplicated(false);
    setIsCheckingDup(false);
  };

  // 닉네임 변경
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setNickname(next);
    if (!isValidNickname(next)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else {
      setNicknameError(null);
    }
  };

  const handleNicknameBlur = () => {
    const v = (nickname ?? '').trim();
    setNickname(v);
    if (!isValidNickname(v)) {
      setNicknameError('닉네임은 2~8자의 완성형 한글/영문/숫자만 가능합니다.');
    } else if (isDuplicated) {
      setNicknameError('이미 사용 중인 닉네임입니다.');
    } else {
      setNicknameError(null);
    }
  };

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
      setIsCheckingDup(true);
      setIsDuplicated(false);

      dupTimerRef.current = window.setTimeout(async () => {
        const controller = new AbortController();
        dupAbortRef.current = controller;
        try {
          const res = await fetch(DUP_API + encodeURIComponent(value), {
            method: 'GET',
            signal: controller.signal,
          });
          const json = await res.json().catch(() => null);
          const duplicated = !!json?.data?.isDuplicated;

          setIsDuplicated(duplicated);
          setNicknameError((prev) => {
            if (prev && prev !== '이미 사용 중인 닉네임입니다.') return prev;
            return duplicated ? '이미 사용 중인 닉네임입니다.' : null;
          });
        } catch {
          setNicknameError((prev) => prev ?? null);
        } finally {
          setIsCheckingDup(false);
          dupAbortRef.current = null;
        }
      }, 400);
    } else {
      setIsCheckingDup(false);
      setIsDuplicated(false);
      setNicknameError((prev) => (prev === '이미 사용 중인 닉네임입니다.' ? null : prev));
    }

    return () => {
      if (dupTimerRef.current) {
        clearTimeout(dupTimerRef.current);
        dupTimerRef.current = null;
      }
      dupAbortRef.current?.abort();
    };
  }, [nickname, initialNickname, nicknameDisabled]);

  // 블로그/GitHub URL
  const onBlogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlogUrl(e.target.value);
    if (blogError) setBlogError('');
  };

  const onGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
    if (githubError) setGithubError('');
  };

  const onBlogBlur = () => {
    const r = validateBlogUrl(blogUrl);
    if (!r.ok) setBlogError(r.msg!);
    else {
      setBlogError('');
      setBlogUrl(r.value || '');
    }
  };

  const onGithubBlur = () => {
    const r = validateGithubUrl(githubUrl);
    if (!r.ok) setGithubError(r.msg!);
    else {
      setGithubError('');
      setGithubUrl(r.value || '');
    }
  };

  // 이미지 제거
  const handleImageRemove = () => {
    setImagePreview('');
    setExistingImageUrl('');
    setSelectedImage(null);
    const input = document.getElementById('image-upload') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  // 저장
  const handleSubmit = async () => {
    if (saving) return;
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
  };

  // 유효성 검사
  const isValid = () => {
    return (
      !saving &&
      !nicknameError &&
      isValidNickname((nickname ?? '').trim()) &&
      !blogError &&
      !githubError &&
      !isDuplicated
    );
  };

  return {
    // 상태
    nickname,
    nicknameError,
    blogUrl,
    blogError,
    githubUrl,
    githubError,
    saving,
    isCheckingDup,
    isDuplicated,
    selectedImage,
    imagePreview,
    existingImageUrl,

    // 이미지 관련
    handleImageUpload,
    handleImageRemove,

    // 이벤트 핸들러
    handleNicknameChange,
    handleNicknameBlur,
    onBlogChange,
    onGithubChange,
    onBlogBlur,
    onGithubBlur,
    handleSubmit,

    // 유틸리티
    initializeForm,
    isValid,
  };
};
