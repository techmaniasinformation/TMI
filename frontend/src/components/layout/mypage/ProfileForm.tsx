import React from 'react';
import { Camera } from 'lucide-react';
import { Input } from '@/components/domain/Input';
import { getSafeProfileUrl, handleProfileImageError } from '@/utils/defaultImages';
import { useTheme } from '@/hooks/store/useStoreActions';

// ===== 통합 ProfileForm 컴포넌트 =====
interface ProfileFormProps {
  // 이미지 관련 props
  imagePreview?: string;
  existingImageUrl?: string;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove?: () => void;
  // 폼 필드 관련 props
  nickname?: string;
  nicknameError?: string | null;
  blogUrl?: string;
  blogError?: string;
  githubUrl?: string;
  githubError?: string;
  isCheckingDup?: boolean;
  isDuplicated?: boolean;
  nicknameDisabled?: boolean;
  nicknameHelperText?: string;
  handleNicknameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNicknameBlur?: () => void;
  onBlogChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGithubChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlogBlur?: () => void;
  onGithubBlur?: () => void;
  // 섹션 표시 제어
  showImageSection?: boolean;
  showFormFields?: boolean;
  // 레이아웃 옵션
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export function ProfileForm({
  // 이미지 관련 props
  imagePreview,
  existingImageUrl,
  handleImageUpload,
  handleImageRemove,
  // 폼 필드 관련 props
  nickname = '',
  nicknameError = null,
  blogUrl = '',
  blogError = '',
  githubUrl = '',
  githubError = '',
  isCheckingDup = false,
  isDuplicated = false,
  nicknameDisabled = false,
  nicknameHelperText,
  handleNicknameChange,
  handleNicknameBlur,
  onBlogChange,
  onGithubChange,
  onBlogBlur,
  onGithubBlur,
  // 섹션 표시 제어
  showImageSection = true,
  showFormFields = true,
  // 레이아웃 옵션
  layout = 'vertical',
  className = '',
}: ProfileFormProps) {
  const { isDarkMode } = useTheme();

  // 이미지 섹션 렌더링
  const renderImageSection = () => {
    if (!showImageSection) return null;

    return (
      <div className="flex flex-col items-center justify-center mb-6">
        <div
          className={`relative w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}
        >
          {imagePreview || existingImageUrl ? (
            <img
              src={getSafeProfileUrl(imagePreview || existingImageUrl)}
              alt="Profile"
              className="w-24 h-24 object-cover"
              draggable={false}
              onError={handleProfileImageError}
            />
          ) : (
            <img
              src={getSafeProfileUrl(null)}
              alt="Profile"
              className="w-24 h-24 object-cover"
              draggable={false}
              onError={handleProfileImageError}
            />
          )}
          {handleImageUpload && (
            <label
              htmlFor="image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
          )}
          {handleImageUpload && (
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          )}
        </div>

        {(imagePreview || existingImageUrl) && handleImageRemove && (
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className={`text-xs underline ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}
              onClick={handleImageRemove}
            >
              이미지 제거
            </button>
          </div>
        )}
      </div>
    );
  };

  // 폼 필드 섹션 렌더링
  const renderFormFields = () => {
    if (!showFormFields) return null;

    return (
      <div className="space-y-4">
        {/* 닉네임 */}
        {handleNicknameChange && (
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
        )}

        {/* 블로그 URL */}
        {onBlogChange && (
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
        )}

        {/* GitHub URL */}
        {onGithubChange && (
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
        )}
      </div>
    );
  };

  // 레이아웃에 따른 렌더링
  if (layout === 'horizontal') {
    return (
      <div className={`flex items-start space-x-6 ${className}`}>
        {renderImageSection()}
        <div className="flex-1">
          {renderFormFields()}
        </div>
      </div>
    );
  }

  // 기본 vertical 레이아웃
  return (
    <div className={className}>
      {renderImageSection()}
      {renderFormFields()}
    </div>
  );
}

// ===== 편의 함수들 (기존 API 호환성) =====

// 이미지 섹션만 렌더링
export function ProfileImageSection({
  imagePreview,
  existingImageUrl,
  handleImageUpload,
  handleImageRemove,
}: {
  imagePreview: string;
  existingImageUrl: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
}) {
  return (
    <ProfileForm
      imagePreview={imagePreview}
      existingImageUrl={existingImageUrl}
      handleImageUpload={handleImageUpload}
      handleImageRemove={handleImageRemove}
      showFormFields={false}
    />
  );
}

// 폼 필드만 렌더링
export function ProfileFormFields({
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
}: {
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
}) {
  return (
    <ProfileForm
      nickname={nickname}
      nicknameError={nicknameError}
      blogUrl={blogUrl}
      blogError={blogError}
      githubUrl={githubUrl}
      githubError={githubError}
      isCheckingDup={isCheckingDup}
      isDuplicated={isDuplicated}
      nicknameDisabled={nicknameDisabled}
      nicknameHelperText={nicknameHelperText}
      handleNicknameChange={handleNicknameChange}
      handleNicknameBlur={handleNicknameBlur}
      onBlogChange={onBlogChange}
      onGithubChange={onGithubChange}
      onBlogBlur={onBlogBlur}
      onGithubBlur={onGithubBlur}
      showImageSection={false}
    />
  );
}
