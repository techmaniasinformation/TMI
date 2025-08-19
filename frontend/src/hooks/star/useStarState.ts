import { useState } from 'react';

// 스타 상태 관리 훅
export const useStarState = () => {
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);

  return {
    // 상태
    isStarred,
    isStarLoading,

    // 상태 설정
    setIsStarred,
    setIsStarLoading,
  };
};
