// NotificationsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

import ClientPagination from '@/components/domain/ClientPagination';
import NotificationItem from '@/components/layout/notifications/NotifiactionItem';
import NotificationToolbar from '@/components/layout/notifications/NotifiactionToolbar';
import NoNotifications from '@/components/layout/notifications/NoNotifications';
import NotificationLoader from '@/components/layout/notifications/NotificationLoader';

import { useUserStore } from '@/stores/userStore';
import { fetchNotifications } from '@/api/notification';
import type { NotificationStatus } from '@/types/notification/notificatios';

// 화면에서 사용하던 인터페이스(유지)
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
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const memberId = user?.memberId;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const itemsPerPage = 5;

  // 서버 응답 → 화면 모델 매핑
  const adapt = useCallback((srv: any): Notification => {
    let mappedType: Notification['type'] = 'post';
    switch (srv.notificationType) {
      case 'BADGE_ACQUIRED':
        mappedType = 'badge';
        break;
      case 'NEW_COMMENT':
        mappedType = 'comment';
        break;
      default:
        mappedType = 'post';
    }

    return {
      id: String(srv.notificationId),
      type: mappedType,
      message: srv.content ?? '',
      timestamp: srv.createdAt ?? '',
      isRead: !!srv.isRead,
      postId: srv.postId != null ? String(srv.postId) : undefined,
      badgeType: srv.badgeUrl ?? undefined,
      userAvatar: srv.memberProfileUrl ?? srv.companyProfileUrl ?? undefined,
    };
  }, []);

  // 목록 로드
  const load = useCallback(async () => {
    if (!memberId) {
      setNotifications([]);
      setLoadError('로그인이 필요합니다.');
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const status: NotificationStatus = showUnreadOnly ? 'unread' : 'all';
      const list = await fetchNotifications(memberId, status);
      const adapted = list.map(adapt);

      // 최신순
      adapted.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(adapted);
      setCurrentPage(1); // 필터 바뀌면 1페이지로
    } catch (e: any) {
      console.error(e);
      setLoadError(e?.message || '알림을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [memberId, showUnreadOnly, adapt]);

  useEffect(() => {
    load();
  }, [load]);

  // 클릭 시 읽음 처리(로컬 UI)
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    // TODO: 서버 읽음처리 API 있으면 여기서 호출
  };

  // 개별 삭제(로컬 UI)
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    // TODO: 서버 삭제 API 있으면 호출
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    // TODO: 서버 일괄 읽음 API 있으면 호출
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    // TODO: 서버 일괄 삭제 API 있으면 호출
  };

  if (loading) return <NotificationLoader />;

  // 필터링은 서버에 맡겼으므로 클라이언트 필터링 제거
  const filteredNotifications = notifications;

  return (
    <div className="max-w-[848px] mx-auto">
      <NotificationToolbar
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={setShowUnreadOnly}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAll={handleDeleteAll}
      />

      {loadError && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
          {loadError}
        </div>
      )}

      {filteredNotifications.length === 0 ? (
        <NoNotifications showUnreadOnly={showUnreadOnly} />
      ) : (
        <ClientPagination
          data={filteredNotifications}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          renderItem={(notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              onDelete={handleDeleteNotification}
            />
          )}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
