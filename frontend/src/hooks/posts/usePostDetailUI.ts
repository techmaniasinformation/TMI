import { useMemo } from 'react';
import { useUserStore } from '@/stores/userStore';

export function usePostDetailUI(postData: any) {
  const { user } = useUserStore();

  // 작성자 여부 확인
  const isAuthor = useMemo(() => {
    return user?.memberId === postData?.memberId;
  }, [user?.memberId, postData?.memberId]);

  // 팔로우 버튼 표시 여부
  const showFollowButton = useMemo(() => {
    if (!postData) return false;
    
    return (
      // 1. 멤버ID가 현재 전역변수 ID와 같지 않음
      user?.memberId !== postData.memberId &&
      // 2. 상대방 멤버ID가 1이지만 companyId가 있음
      (postData.memberId !== 1 || (postData.memberId === 1 && postData.companyId !== null))
    );
  }, [user?.memberId, postData]);

  // 스타 버튼 표시 여부
  const showStarButton = useMemo(() => {
    return !isAuthor;
  }, [isAuthor]);

  return {
    isAuthor,
    showFollowButton,
    showStarButton,
  };
}
