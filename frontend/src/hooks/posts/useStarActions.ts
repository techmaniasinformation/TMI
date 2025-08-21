import { useCallback, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { addStar, removeStar } from '@/utils/starUtils';
import { fetchUserStars, findStarByPostId } from '@/api/star/starApiService';
import type { useStarState } from './useStarState';

interface UseStarActionsProps {
  postId: string;
  state: ReturnType<typeof useStarState>;
}

// 스타 액션 핸들러 훅
export const useStarActions = ({ postId, state }: UseStarActionsProps) => {
  const { user } = useUserStore();
  const { isStarred, isStarLoading, setIsStarred, setIsStarLoading } = state;

  // 스타 상태 확인
  const checkStarStatus = useCallback(async () => {
    if (!user?.memberId || !postId) return;

    try {
      const stars = await fetchUserStars(user.memberId);
      const foundStar = findStarByPostId(stars, postId);
      setIsStarred(!!foundStar);
    } catch (error) {
      console.error('스타 상태 확인 실패:', error);
    }
  }, [user?.memberId, postId, setIsStarred]);

  // 스타 토글
  const toggleStar = useCallback(async () => {
    if (isStarLoading) return;
    
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsStarLoading(true);
    try {
      if (isStarred) {
        // 스타 취소
        const stars = await fetchUserStars(user.memberId);
        const foundStar = findStarByPostId(stars, postId);
        
        if (foundStar) {
          const removeResult = await removeStar(foundStar.starId.toString());
          
          if (!removeResult.success) {
            throw new Error(removeResult.error || '스타 취소 실패');
          }
          
          setIsStarred(false);
          alert('스타를 취소했습니다');
        } else {
          alert('스타 정보를 찾을 수 없습니다.');
        }
      } else {
        // 스타 추가
        const addResult = await addStar(user.memberId, postId);

        if (!addResult.success) {
          throw new Error(addResult.error || '스타 추가 실패');
        }
        
        setIsStarred(true);
        alert('스타했습니다');
      }
    } catch (err) {
      alert('스타 요청에 실패했습니다.');
    } finally {
      setIsStarLoading(false);
    }
  }, [isStarred, user?.memberId, postId, isStarLoading, setIsStarred, setIsStarLoading]);

  // 초기 스타 상태 확인
  useEffect(() => {
    checkStarStatus();
  }, [checkStarStatus]);

  return {
    checkStarStatus,
    toggleStar,
  };
};
