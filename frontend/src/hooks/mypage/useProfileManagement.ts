import { useState } from 'react';
import { useNicknameCooldown } from './useNicknameCooldown';
import { useProfileData } from './useProfileData';
import { useProfileSave } from './useProfileSave';

export function useProfileManagement(isMyPage: boolean, myId: number | undefined, isCompany: boolean) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 분리된 커스텀 훅들 사용
  const { modalInit, setModalInit } = useProfileData(isMyPage, myId, isCompany);
  const { nicknameDaysLeft, recordNicknameChange } = useNicknameCooldown(myId, modalInit.nickname);
  const { handleProfileSave } = useProfileSave(
    isMyPage,
    myId,
    modalInit,
    nicknameDaysLeft,
    recordNicknameChange,
    setModalInit,
    setRefreshKey
  );

  return {
    modalInit,
    nicknameDaysLeft,
    refreshKey,
    handleProfileSave,
  };
}
