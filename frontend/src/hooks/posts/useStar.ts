import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { 
  addStar, 
  removeStar 
} from '@/utils/starUtils';

// 스타 상태 관리 훅
export const useStar = (postId: string) => {
  const { user } = useUserStore();
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);

  // 스타 상태 확인
  const checkStarStatus = useCallback(async () => {
    if (!user?.memberId || !postId) return;

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${user.memberId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const starList = data.data?.stars || [];
        const foundStar = starList.find((star: any) => star.postId.toString() === postId);
        setIsStarred(!!foundStar);
      }
    } catch (error) {
      console.error('스타 상태 확인 실패:', error);
    }
  }, [user?.memberId, postId]);

  useEffect(() => {
    checkStarStatus();
  }, [checkStarStatus]);

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
        // 스타 취소 - 서버에서 현재 스타 정보 가져오기
        try {
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${user.memberId}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            const starList = data.data?.stars || [];
            const foundStar = starList.find((star: any) => star.postId.toString() === postId);
            
            if (foundStar) {
              const removeResult = await removeStar(foundStar.starId.toString());
              
              if (!removeResult.success) {
                throw new Error(removeResult.error || '스타 취소 실패');
              }
              
              // UI 상태 업데이트
              setIsStarred(false);
              
              alert('스타를 취소했습니다');
            } else {
              alert('스타 정보를 찾을 수 없습니다.');
            }
          } else {
            alert('스타 정보를 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('스타 취소 실패:', error);
          alert('스타 취소에 실패했습니다.');
        }
      } else {
        // 스타 추가
        const addResult = await addStar(user.memberId, postId);

        if (!addResult.success) {
          throw new Error(addResult.error || '스타 추가 실패');
        }
        
        // UI 상태 업데이트
        setIsStarred(true);
        
        alert('스타했습니다');
      }
    } catch (err) {
      alert('스타 요청에 실패했습니다.');
    } finally {
      setIsStarLoading(false);
    }
  }, [isStarred, user?.memberId, postId, isStarLoading]);

  return {
    isStarred,
    isStarLoading,
    toggleStar
  };
};
