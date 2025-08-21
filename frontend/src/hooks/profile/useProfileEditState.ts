import { useState, useCallback } from 'react';
import { useImageCompression } from '@/hooks/useImageCompression';

interface UseProfileEditStateProps {
  initialNickname: string;
  initialBlogUrl: string;
  initialGithubUrl?: string;
  initialProfileImageUrl?: string;
}

// 프로필 수정 상태 관리 훅
export const useProfileEditState = ({
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
}: UseProfileEditStateProps) => {
  // 이미지 압축 커스텀 훅 사용
  const imageCompression = useImageCompression();

  // 기본 상태
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

  // 초기화
  const initializeForm = useCallback(() => {
    setNickname(initialNickname);
    setBlogUrl(initialBlogUrl || '');
    setGithubUrl(initialGithubUrl || '');
    setNicknameError(null);
    setBlogError('');
    setGithubError('');
    setIsDuplicated(false);
    setIsCheckingDup(false);
    imageCompression.setImagePreview('');
    imageCompression.setExistingImageUrl(initialProfileImageUrl || '');
    imageCompression.setSelectedImage(null);
  }, [initialNickname, initialBlogUrl, initialGithubUrl, initialProfileImageUrl, imageCompression]);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setNicknameError(null);
    setBlogError('');
    setGithubError('');
  }, []);

  // 닉네임 중복 상태 설정
  const setDuplicateStatus = useCallback((checking: boolean, duplicated: boolean) => {
    setIsCheckingDup(checking);
    setIsDuplicated(duplicated);
  }, []);

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

    // 상태 설정
    setNickname,
    setNicknameError,
    setBlogUrl,
    setBlogError,
    setGithubUrl,
    setGithubError,
    setSaving,
    setDuplicateStatus,

    // 상태 관리
    initializeForm,
    clearErrors,

    // 이미지 압축
    ...imageCompression
  };
};

