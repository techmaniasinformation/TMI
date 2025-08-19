import { useProfileEditState } from './profile/useProfileEditState';
import { useProfileEditActions } from './profile/useProfileEditActions';

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

// 프로필 수정 훅
export const useProfileEdit = (props: UseProfileEditProps) => {
  const state = useProfileEditState({
    initialNickname: props.initialNickname,
    initialBlogUrl: props.initialBlogUrl,
    initialGithubUrl: props.initialGithubUrl,
    initialProfileImageUrl: props.initialProfileImageUrl,
  });

  const actions = useProfileEditActions(state, {
    initialNickname: props.initialNickname,
    nicknameDisabled: props.nicknameDisabled,
    onSave: props.onSave,
  });

  return {
    // 상태
    nickname: state.nickname,
    nicknameError: state.nicknameError,
    blogUrl: state.blogUrl,
    blogError: state.blogError,
    githubUrl: state.githubUrl,
    githubError: state.githubError,
    saving: state.saving,
    isCheckingDup: state.isCheckingDup,
    isDuplicated: state.isDuplicated,
    selectedImage: state.selectedImage,
    imagePreview: state.imagePreview,
    existingImageUrl: state.existingImageUrl,

    // 이미지 관련
    handleImageUpload: state.handleImageUpload,
    handleImageRemove: actions.handleImageRemove,

    // 이벤트 핸들러
    handleNicknameChange: actions.handleNicknameChange,
    handleNicknameBlur: actions.handleNicknameBlur,
    onBlogChange: actions.onBlogChange,
    onGithubChange: actions.onGithubChange,
    onBlogBlur: actions.onBlogBlur,
    onGithubBlur: actions.onGithubBlur,
    handleSubmit: actions.handleSubmit,

    // 유틸리티
    initializeForm: state.initializeForm,
    isValid: actions.isValid,
  };
};

