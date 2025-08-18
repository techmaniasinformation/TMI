import React from 'react';
import { Input } from '@/components/domain/Input';
import { useThemeStore } from '@/stores/themeStore';

interface ProfileFormFieldsProps {
  nickname: string;
  nicknameError: string | null;
  blogUrl: string;
  blogError: string;
  githubUrl: string;
  githubError: string;
  isCheckingDup: boolean;
  isDuplicated: boolean;
  nicknameDisabled?: boolean;
  nicknameHelperText?: string;
  handleNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNicknameBlur: () => void;
  onBlogChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGithubChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlogBlur: () => void;
  onGithubBlur: () => void;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  nickname,
  nicknameError,
  blogUrl,
  blogError,
  githubUrl,
  githubError,
  isCheckingDup,
  isDuplicated,
  nicknameDisabled,
  nicknameHelperText,
  handleNicknameChange,
  handleNicknameBlur,
  onBlogChange,
  onGithubChange,
  onBlogBlur,
  onGithubBlur,
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="space-y-4 mt-2">
      {/* 닉네임 */}
      <div>
        <label
          className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          닉네임
        </label>
        <Input
          value={nickname}
          onChange={handleNicknameChange}
          onBlur={handleNicknameBlur}
          disabled={!!nicknameDisabled}
          placeholder="완성형 한글/영문/숫자 (2~8자)"
          aria-invalid={!!nicknameError}
        />
        {(nicknameHelperText || nicknameError || isCheckingDup || isDuplicated) && (
          <p
            className={`mt-1 text-xs ${
              nicknameError
                ? 'text-red-500'
                : isDuplicated
                ? 'text-red-500'
                : 'text-gray-500'
            }`}
          >
            {nicknameError
              ? nicknameError
              : isCheckingDup
              ? '중복 확인 중...'
              : isDuplicated
              ? '이미 사용 중인 닉네임입니다.'
              : nicknameHelperText || '사용 가능한 닉네임입니다.'}
          </p>
        )}
      </div>

      {/* 블로그 URL */}
      <div>
        <label
          className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          블로그 URL
        </label>
        <Input
          value={blogUrl}
          onChange={onBlogChange}
          onBlur={onBlogBlur}
          placeholder="blog.naver.com/..., *.tistory.com, velog.io/..."
          aria-invalid={!!blogError}
          inputMode="url"
        />
        {blogError && (
          <p className="mt-1 text-xs text-red-500">{blogError}</p>
        )}
      </div>

      {/* GitHub URL */}
      <div>
        <label
          className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          GitHub URL
        </label>
        <Input
          value={githubUrl}
          onChange={onGithubChange}
          onBlur={onGithubBlur}
          placeholder="github.com/사용자명 또는 사용자명.github.io"
          aria-invalid={!!githubError}
          inputMode="url"
        />
        {githubError && (
          <p className="mt-1 text-xs text-red-500">{githubError}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileFormFields;
