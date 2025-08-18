import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import type { PostDetail } from './usePostData';

// 팔로우 상태 관리 훅
export const useFollow = (postData: PostDetail | null, companyId?: string) => {
  const { user, followUser, followCompany, setFollowUser, setFollowCompany } = useUserStore();
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

  // user 상태가 로드된 후에 팔로우 상태 확인
  useEffect(() => {
    if (user && postData) {
      checkFollowStatus();
    }
  }, [user, postData, checkFollowStatus]);

  // 팔로우 토글
  const toggleFollow = useCallback(async () => {
    if (!postData) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    // 로그인 상태 확인
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFollowing) {
        // 팔로우 취소
        if (postData.memberId === 1 && !postData.companyId) {
          alert('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (companyId || postData.companyId) {
          // 회사 팔로우 취소
          const targetCompanyId = companyId || postData.companyId;
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow?followerId=${user.memberId}&companyId=${targetCompanyId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowCompany(followCompany.filter(id => id !== Number(targetCompanyId)));
            setIsFollowing(false);
            setCompanyFollowId(null);
            alert('회사 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 취소
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow?followerId=${user.memberId}&followeeId=${postData.memberId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowUser(followUser.filter(id => id !== postData.memberId));
            setIsFollowing(false);
            setMemberFollowId(null);
            alert('사용자 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
      } else {
        // 팔로우 추가
        if (postData.memberId === 1 && !postData.companyId) {
          alert('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (companyId || postData.companyId) {
          // 회사 팔로우 추가
          const targetCompanyId = companyId || postData.companyId;
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerId: user.memberId,
              companyId: targetCompanyId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.data?.companyFollowId) {
            setCompanyFollowId(result.data.companyFollowId);
          }

          setFollowCompany([...followCompany, Number(targetCompanyId)]);
          setIsFollowing(true);
          alert('회사를 팔로우했습니다.');
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 추가
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerId: user.memberId,
              followeeId: postData.memberId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.data?.memberFollowId) {
            setMemberFollowId(result.data.memberFollowId);
          }
          
          setFollowUser([...followUser, postData.memberId]);
          setIsFollowing(true);
          alert('사용자를 팔로우했습니다.');
        }
      }
    } catch (err) {
      console.error('❌ [useFollow] 팔로우 요청 실패:', err);
      alert('팔로우 요청에 실패했습니다.');
    }
  }, [isFollowing, postData, user?.memberId, followUser, followCompany, setFollowUser, setFollowCompany, memberFollowId, companyFollowId, companyId]);

  return {
    isFollowing,
    toggleFollow
  };
};
