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
import {
  fetchNotifications,
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications as apiDeleteAllNotifications,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
} from '@/api/notification';
import type { NotificationStatus } from '@/types/notification/notifications';

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

// ---- 추가 유틸: 이미지 경로 처리/폴백 ----
const BADGE_CDN_BASE =
  (import.meta as any).env?.VITE_BADGE_CDN ?? '/badges'; // 배지 파일명 접두 경로
const DEFAULT_AVATAR = '/default-avatar.png';

const cleanUrl = (u?: string | null) => (u && u.trim() ? u : undefined);
const resolveBadgeSrc = (file?: string | null) =>
  file && file.trim() ? `${BADGE_CDN_BASE}/${file}` : undefined;

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const memberId = user?.memberId;
  const myProfileUrl = user?.memberProfileUrl ?? undefined;

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
      case 'MEMBER_NEW_POST': // 팔로우한 사람이 새 글
        mappedType = 'post';
        break;
      default:
        mappedType = 'post';
    }

    // 썸네일 결정
    let avatar: string | undefined;
    if (mappedType === 'badge') {
      avatar = resolveBadgeSrc(srv.badgeUrl); // 배지 파일명 → CDN 경로
    } else if (mappedType === 'comment') {
      avatar = cleanUrl(myProfileUrl) ?? DEFAULT_AVATAR; // 댓글이면 내 프로필
    } else {
      // post (팔로우 새 글 포함): 서버가 준 프로필
      avatar =
        cleanUrl(srv.memberProfileUrl) ??
        cleanUrl(srv.companyProfileUrl) ??
        undefined; // 최종 폴백은 아래 load()에서
    }

    return {
      id: String(srv.notificationId),
      type: mappedType,
      message: srv.content ?? '',
      timestamp: srv.createdAt ?? '',
      isRead: !!srv.isRead,
      postId: srv.postId != null ? String(srv.postId) : undefined,
      badgeType: srv.badgeUrl ?? undefined,
      userAvatar: avatar,
      userId: srv.memberId != null ? String(srv.memberId) : undefined,
      userName: srv.nickname ?? srv.companyName ?? undefined,
    };
  }, [myProfileUrl]);

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
      let adapted = list.map(adapt);

      // 최신순
      adapted.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // 최종 폴백: 썸네일 비어 있으면 기본 아바타
      adapted = adapted.map(n => ({ ...n, userAvatar: n.userAvatar ?? DEFAULT_AVATAR }));

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

  // ✅ 클릭 시 읽음 처리(서버 연동 + 낙관적) 후, 타입별 이동
  const handleNotificationClick = async (notification: Notification) => {
    // 1) 낙관적 업데이트
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // 2) 서버 읽음 처리
    try {
      await apiMarkNotificationRead(Number(notification.id));
    } catch (e) {
      // 실패 시 롤백
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, isRead: false } : n))
      );
      console.error(e);
      alert('읽음 처리에 실패했습니다.');
      return;
    }

    // 3) 타입별 이동
    if ((notification.type === 'comment' || notification.type === 'post') && notification.postId) {
      navigate(`/post/${notification.postId}`);
      return;
    }

    if (notification.type === 'badge') {
      // 배지 → 마이페이지
      if (memberId) {
        const path = ROUTES?.MY_PAGE
          ? ROUTES.MY_PAGE.replace(':id', String(memberId))
          : `/mypage/${memberId}`;
        navigate(path);
      }
      return;
    }
  };

  // 개별 삭제(서버 연동 + 낙관적 업데이트)
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!memberId) return;

    const prev = notifications;
    setNotifications(prev.filter(n => n.id !== id)); // 낙관적 제거
    try {
      await apiDeleteNotification(Number(id), memberId);
    } catch (err) {
      setNotifications(prev); // 롤백
      console.error(err);
      alert('알림 삭제에 실패했습니다.');
    }
  };

  // 전체 읽음(서버 연동 + 낙관적 업데이트)
  const handleMarkAllAsRead = async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications(prev.map(n => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotificationsRead(memberId);
    } catch (err) {
      setNotifications(prev); // 롤백
      console.error(err);
      alert('전체 읽음 처리에 실패했습니다.');
    }
  };

  // 전체 삭제(서버 연동 + 낙관적 업데이트)
  const handleDeleteAll = async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications([]); // 낙관적
    try {
      await apiDeleteAllNotifications(memberId);
    } catch (err) {
      setNotifications(prev); // 롤백
      console.error(err);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  if (loading) return <NotificationLoader />;

  const filteredNotifications = notifications; // 서버에서 status로 필터링됨

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
