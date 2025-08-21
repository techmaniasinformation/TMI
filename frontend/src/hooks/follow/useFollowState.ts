import { useState, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import type { PostDetail } from '../posts/usePostData';

// 팔로우 상태 관리 훅
export const useFollowState = (postData: PostDetail | null, companyId?: string) => {
  const { followUser, followCompany } = useUserStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [memberFollowId, setMemberFollowId] = useState<number | null>(null);
  const [companyFollowId, setCompanyFollowId] = useState<number | null>(null);

  // 팔로우 상태 확인
  const checkFollowStatus = useCallback(() => {
    if (!postData) return;

    const targetCompanyId = companyId || postData.companyId;
    if (targetCompanyId) {
      const isFollowingCompany = followCompany.includes(Number(targetCompanyId));
      setIsFollowing(isFollowingCompany);
    } else if (postData.memberId) {
      const isFollowingUser = followUser.includes(postData.memberId);
      setIsFollowing(isFollowingUser);
    }
  }, [postData, followUser, followCompany, companyId]);

  return {
    // 상태
    isFollowing,
    memberFollowId,
    companyFollowId,

    // 상태 설정
    setIsFollowing,
    setMemberFollowId,
    setCompanyFollowId,

    // 상태 관리
    checkFollowStatus,
  };
};

