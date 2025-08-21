import { useCallback } from 'react';
import { validateBlogUrl, validateGithubUrl } from '@/utils/validationUtils';
import type { useProfileEditState } from './useProfileEditState';

export function useProfileEditUrls(
  state: ReturnType<typeof useProfileEditState>
) {
  const { blogUrl, githubUrl, setBlogError, setGithubError } = state;

  // 블로그 URL 관리
  const onBlogChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    state.setBlogUrl(e.target.value);
    if (state.blogError) state.setBlogError('');
  }, [state]);

  const onBlogBlur = useCallback(() => {
    const r = validateBlogUrl(blogUrl);
    if (!r.ok) state.setBlogError(r.msg!);
    else {
      state.setBlogError('');
      state.setBlogUrl(r.value || '');
    }
  }, [blogUrl, state]);

  // GitHub URL 관리
  const onGithubChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    state.setGithubUrl(e.target.value);
    if (state.githubError) state.setGithubError('');
  }, [state]);

  const onGithubBlur = useCallback(() => {
    const r = validateGithubUrl(githubUrl);
    if (!r.ok) state.setGithubError(r.msg!);
    else {
      state.setGithubError('');
      state.setGithubUrl(r.value || '');
    }
  }, [githubUrl, state]);

  return {
    onBlogChange,
    onBlogBlur,
    onGithubChange,
    onGithubBlur,
  };
}
