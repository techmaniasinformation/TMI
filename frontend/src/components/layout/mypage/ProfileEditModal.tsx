import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/domain/Dialog';
import { Button } from '@/components/foundation/button';
import { useTheme } from '@/hooks/store/useStoreActions';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { ProfileForm } from './ProfileForm';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialNickname,
  initialBlogUrl,
  initialGithubUrl,
  initialProfileImageUrl,
  nicknameDisabled,
  nicknameHelperText,
  onSave,
}) => {
  const { isDarkMode } = useTheme();
  
  const {
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
  } = useProfileEdit({
    initialNickname,
    initialBlogUrl,
    initialGithubUrl,
    initialProfileImageUrl,
    nicknameDisabled,
    onSave,
  });

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      initializeForm();
    }
  }, [isOpen, initializeForm]);

  const handleSave = async () => {
    await handleSubmit();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/70 z-40" />
      <DialogContent
        className={`w-[512px] z-50 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white'
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            프로필 수정
          </DialogTitle>
        </DialogHeader>

        <ProfileForm
          layout="vertical"
          imagePreview={imagePreview}
          existingImageUrl={existingImageUrl}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
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
        />

        {/* 저장 버튼 */}
        <div className="pt-6">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isValid()}
            className={`w-full h-10 text-white font-semibold ${
              saving ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {saving ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
