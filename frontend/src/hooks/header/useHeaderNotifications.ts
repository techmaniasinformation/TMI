import { useEffect } from 'react';
import type { useHeaderState } from './useHeaderState';

// 헤더 알림 관리 훅
export const useHeaderNotifications = (state: ReturnType<typeof useHeaderState>) => {
  const { user, isAuthenticated, setHasUnreadNotifications, setUnreadCount } = state;

  // 알림 조회
  useEffect(() => {
    if (isAuthenticated && user?.memberId) {
      fetch(
        `https://i13a509.p.ssafy.io/api/v1/notification?memberId=${user.memberId}&status=unread`,
        { method: 'GET', credentials: 'include' }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.status === 'SUCCESS') {
            const contentList = data.data?.content || [];
            setHasUnreadNotifications(contentList.length > 0);
            setUnreadCount(contentList.length);
          } else {
            setHasUnreadNotifications(false);
            setUnreadCount(0);
          }
        })
        .catch((err) => {
          console.error('알림 조회 실패:', err);
          setHasUnreadNotifications(false);
          setUnreadCount(0);
        });
    }
  }, [isAuthenticated, user?.memberId, setHasUnreadNotifications, setUnreadCount]);
};
