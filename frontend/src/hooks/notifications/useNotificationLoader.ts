import { useState, useCallback } from 'react';
import { fetchNotifications } from '@/api/notification';
import type { NotificationStatus } from '@/types/notification/notifications';
import { DEFAULT_IMAGES } from '@/utils/defaultImages';

interface Notification {
  id: string;
  type: 'badge' | 'comment' | 'post';
  message: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  postId?: string;
  badgeType?: string;
  avatarKind?: 'PROFILE' | 'COMPANY' | 'BADGE';
}

export function useNotificationLoader(
  memberId: number | undefined,
  adapt: (srv: any) => Notification
) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 목록 로드
  const load = useCallback(async (showUnreadOnly: boolean) => {
    if (!memberId) {
      setNotifications([]);
      setLoadError('로그인이 필요합니다.');
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const status: NotificationStatus = showUnreadOnly ? 'unread' : 'all';
      const list = await fetchNotifications();
      let adapted = list.map(adapt);

      adapted.sort(
        (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // 최종 폴백: 비어있으면 기본 이미지(사람)로
      adapted = adapted.map((n: any) => ({
        ...n,
        userAvatar: n.userAvatar ?? DEFAULT_IMAGES.PROFILE,
      }));

      setNotifications(adapted);
    } catch (e: any) {
      console.error(e);
      setLoadError(e?.message || '알림을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [memberId, adapt]);

  return {
    notifications,
    setNotifications,
    loading,
    loadError,
    load,
  };
}
