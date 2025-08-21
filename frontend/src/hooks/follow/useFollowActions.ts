import { useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { addCompanyFollow, removeCompanyFollow, addMemberFollow, removeMemberFollow } from '@/api/follow/followApiService';
import type { PostDetail } from '../posts/usePostData';
import type { useFollowState } from './useFollowState';

// 팔로우 액션 훅
export const useFollowActions = (
  postData: PostDetail | null,
  companyId: string | undefined,
  state: ReturnType<typeof useFollowState>
) => {
  const { user, followUser, followCompany, setFollowUser, setFollowCompany } = useUserStore();
  const { isFollowing, setIsFollowing, setMemberFollowId, setCompanyFollowId } = state;

  // 팔로우 가능 여부 검증
  const validateFollowable = useCallback(() => {
    if (!postData) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return false;
    }
    
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return false;
    }

    if (postData.memberId === 1 && !postData.companyId) {
      alert('해당 사용자는 팔로우할 수 없습니다.');
      return false;
    }

    return true;
  }, [postData, user?.memberId]);

  // 회사 팔로우 처리
  const handleCompanyFollow = useCallback(async (targetCompanyId: string, isAdding: boolean) => {
    if (!user?.memberId) return;

    try {
      if (isAdding) {
        const result = await addCompanyFollow(user.memberId, targetCompanyId);
        if (result.data?.companyFollowId) {
          setCompanyFollowId(result.data.companyFollowId);
        }
        setFollowCompany([...followCompany, Number(targetCompanyId)]);
        setIsFollowing(true);
        alert('회사를 팔로우했습니다.');
      } else {
        await removeCompanyFollow(user.memberId, targetCompanyId);
        setFollowCompany(followCompany.filter(id => id !== Number(targetCompanyId)));
        setIsFollowing(false);
        setCompanyFollowId(null);
        alert('회사 팔로우를 취소했습니다.');
      }
    } catch (error) {
      console.error('회사 팔로우 처리 실패:', error);
      throw error;
    }
  }, [user?.memberId, followCompany, setFollowCompany, setIsFollowing, setCompanyFollowId]);

  // 개인 사용자 팔로우 처리
  const handleMemberFollow = useCallback(async (followeeId: number, isAdding: boolean) => {
    if (!user?.memberId) return;

    try {
      if (isAdding) {
        const result = await addMemberFollow(user.memberId, followeeId);
        if (result.data?.memberFollowId) {
          setMemberFollowId(result.data.memberFollowId);
        }
        setFollowUser([...followUser, followeeId]);
        setIsFollowing(true);
        alert('사용자를 팔로우했습니다.');
      } else {
        await removeMemberFollow(user.memberId, followeeId);
        setFollowUser(followUser.filter(id => id !== followeeId));
        setIsFollowing(false);
        setMemberFollowId(null);
        alert('사용자 팔로우를 취소했습니다.');
      }
    } catch (error) {
      console.error('개인 사용자 팔로우 처리 실패:', error);
      throw error;
    }
  }, [user?.memberId, followUser, setFollowUser, setIsFollowing, setMemberFollowId]);

  // 팔로우 토글
  const toggleFollow = useCallback(async () => {
    if (!validateFollowable()) return;

    try {
      const targetCompanyId = companyId || postData?.companyId;
      
      if (targetCompanyId) {
        // 회사 팔로우 처리
        await handleCompanyFollow(String(targetCompanyId), !isFollowing);
      } else if (postData?.memberId) {
        // 개인 사용자 팔로우 처리
        await handleMemberFollow(postData.memberId, !isFollowing);
      }
    } catch (err) {
      console.error('❌ [useFollow] 팔로우 요청 실패:', err);
      alert('팔로우 요청에 실패했습니다.');
    }
  }, [
    validateFollowable,
    companyId,
    postData,
    isFollowing,
    handleCompanyFollow,
    handleMemberFollow
  ]);

  return {
    toggleFollow,
  };
};

