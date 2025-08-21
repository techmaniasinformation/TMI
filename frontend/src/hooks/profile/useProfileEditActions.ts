import type { useProfileEditState } from './useProfileEditState';
import { useProfileEditNickname } from './useProfileEditNickname';
import { useProfileEditUrls } from './useProfileEditUrls';
import { useProfileEditImage } from './useProfileEditImage';
import { useProfileEditSave } from './useProfileEditSave';

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

  // 분리된 커스텀 훅들 사용
  const { handleNicknameChange, handleNicknameBlur } = useProfileEditNickname(
    state, initialNickname, nicknameDisabled
  );
  
  const { onBlogChange, onBlogBlur, onGithubChange, onGithubBlur } = useProfileEditUrls(state);
  
  const { handleImageRemove } = useProfileEditImage(state);
  
  const { handleSubmit, isValid } = useProfileEditSave(state, { onSave });

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
