import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import {
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications as apiDeleteAllNotifications,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
} from '@/api/notification';

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

export function useNotificationActions(
  memberId: number | undefined,
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) {
  const navigate = useNavigate();

  // 클릭 시 읽음 처리 + 이동
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    try {
      await apiMarkNotificationRead(Number(notification.id));
    } catch (e) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n))
      );
      console.error(e);
      alert('읽음 처리에 실패했습니다.');
      return;
    }

    if (
      (notification.type === 'comment' || notification.type === 'post') &&
      notification.postId
    ) {
      navigate(`/post/${notification.postId}`);
      return;
    }

    if (notification.type === 'badge' && memberId) {
      const path = ROUTES?.MY_PAGE
        ? ROUTES.MY_PAGE.replace(':id', String(memberId))
        : `/mypage/${memberId}`;
      navigate(path);
    }
  }, [memberId, navigate, setNotifications]);

  // 개별 삭제
  const handleDeleteNotification = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!memberId) return;

    const prev = notifications;
    setNotifications(prev.filter((n) => n.id !== id));
    try {
      await apiDeleteNotification(Number(id));
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('알림 삭제에 실패했습니다.');
    }
  }, [memberId, notifications, setNotifications]);

  // 전체 읽음
  const handleMarkAllAsRead = useCallback(async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications(prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotificationsRead();
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('전체 읽음 처리에 실패했습니다.');
    }
  }, [memberId, notifications, setNotifications]);

  // 전체 삭제
  const handleDeleteAll = useCallback(async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications([]);
    try {
      await apiDeleteAllNotifications();
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('전체 삭제에 실패했습니다.');
    }
  }, [memberId, setNotifications]);

  return {
    handleNotificationClick,
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleDeleteAll,
  };
}
