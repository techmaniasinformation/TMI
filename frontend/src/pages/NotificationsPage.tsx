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
import { getSafeProfileUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

// ===== 배지 이미지 import & 매핑 =====
import ai_1 from '@/assets/images/ai_1.png';
import amumu from '@/assets/images/amumu.png';
import aws_1 from '@/assets/images/aws_1.png';
import db_1 from '@/assets/images/db_1.png';
import fctmi_1 from '@/assets/images/fctmi_1.png';
import first_article from '@/assets/images/first_article.png';
import first_comment from '@/assets/images/first_comment.png';
import followmany from '@/assets/images/followmany.png';
import helloworld from '@/assets/images/helloworld.png';
import like10 from '@/assets/images/like10.png';
import like100 from '@/assets/images/like100.png';
import like1000 from '@/assets/images/like1000.png';
import paris from '@/assets/images/paris.png';
import react from '@/assets/images/react.png';
import spring from '@/assets/images/spring.png';
import star_5 from '@/assets/images/star_5.png';
import star_13 from '@/assets/images/star_13.png';
import star_42 from '@/assets/images/star_42.png';
import view1 from '@/assets/images/view1.png';
import view2 from '@/assets/images/view2.png';
import view3 from '@/assets/images/view3.png';
import locked from '@/assets/images/locked.png';

const badgeImages: Record<string, string> = {
  'ai_1.png': ai_1,
  'amumu.png': amumu,
  'aws_1.png': aws_1,
  'db_1.png': db_1,
  'fctmi_1.png': fctmi_1,
  'first_article.png': first_article,
  'first_comment.png': first_comment,
  'followmany.png': followmany,
  'helloworld.png': helloworld,
  'like10.png': like10,
  'like100.png': like100,
  'like1000.png': like1000,
  'paris.png': paris,
  'react.png': react,
  'spring.png': spring,
  'star_5.png': star_5,
  'star_13.png': star_13,
  'star_42.png': star_42,
  'view_50.png': view1,
  'view_100.png': view2,
  'view_1000.png': view3,
  'locked.png': locked,
};

// ================= 인터페이스 =================
interface Notification {
  id: string;
  type: 'badge' | 'comment' | 'post';
  message: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;     // 실제 썸네일 URL
  postId?: string;
  badgeType?: string;
  // ✅ 폴백 판단용(사람/회사/뱃지)
  avatarKind?: 'PROFILE' | 'COMPANY' | 'BADGE';
}

// ---- 유틸: 경로 처리/폴백 ----
const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';
const BADGE_CDN_BASE =
  (import.meta as any).env?.VITE_BADGE_CDN ?? `${BASE_URL}/badge/images`;

const cleanUrl = (u?: string | null) => (u && u.trim() ? u : undefined);
const resolveBadgeSrc = (file?: string | null) => {
  const f = (file ?? '').trim();
  if (!f) return undefined;
  if (/^https?:\/\//i.test(f)) return f;
  return `${BADGE_CDN_BASE}/${f}`;
};

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

  // 서버 응답 → 화면 모델 매핑 (+ avatarKind 설정)
  const adapt = useCallback(
    (srv: any): Notification => {
      let mappedType: Notification['type'] = 'post';
      switch (srv.notificationType) {
        case 'BADGE_ACQUIRED':
          mappedType = 'badge';
          break;
        case 'NEW_COMMENT':
          mappedType = 'comment';
          break;
        case 'MEMBER_NEW_POST':
        default:
          mappedType = 'post';
      }

      let avatar: string | undefined;
      let avatarKind: Notification['avatarKind'] = 'PROFILE';

      if (mappedType === 'badge') {
        const local = badgeImages[srv.badgeUrl as string];
        avatar = local ?? resolveBadgeSrc(srv.badgeUrl);
        avatarKind = 'BADGE';
      } else if (mappedType === 'comment') {
        // 댓글 알림: 사람으로 취급
        avatar = cleanUrl(myProfileUrl);
        avatarKind = 'PROFILE';
      } else {
        // 게시글 알림: 사람/회사 중 무엇이 있는지로 구분
        const memberUrl = cleanUrl(srv.memberProfileUrl);
        const companyUrl = cleanUrl(srv.companyProfileUrl);
        if (memberUrl) {
          avatar = memberUrl;
          avatarKind = 'PROFILE';
        } else if (companyUrl) {
          avatar = companyUrl;
          avatarKind = 'COMPANY';
        } else {
          avatar = undefined;
          avatarKind = 'PROFILE';
        }
      }

      return {
        id: String(srv.notificationId),
        type: mappedType,
        message: srv.content ?? '',
        timestamp: srv.createdAt ?? '',
        isRead: !!srv.isRead,
        postId: srv.postId != null ? String(srv.postId) : undefined,
        badgeType:
          mappedType === 'badge'
            ? badgeImages[srv.badgeUrl as string] ?? resolveBadgeSrc(srv.badgeUrl)
            : undefined,
        userAvatar: avatar,
        userId: srv.memberId != null ? String(srv.memberId) : undefined,
        userName: srv.nickname ?? srv.companyName ?? undefined,
        avatarKind, // ✅ 추가
      };
    },
    [myProfileUrl]
  );

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

      adapted.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // 최종 폴백: 비어있으면 기본 이미지(사람)로
      adapted = adapted.map((n) => ({
        ...n,
        userAvatar: n.userAvatar ?? DEFAULT_IMAGES.PROFILE,
      }));

      setNotifications(adapted);
      setCurrentPage(1);
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

  // 클릭 시 읽음 처리 + 이동
  const handleNotificationClick = async (notification: Notification) => {
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
  };

  // 개별 삭제
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!memberId) return;

    const prev = notifications;
    setNotifications(prev.filter((n) => n.id !== id));
    try {
      await apiDeleteNotification(Number(id), memberId);
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('알림 삭제에 실패했습니다.');
    }
  };

  // 전체 읽음
  const handleMarkAllAsRead = async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications(prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotificationsRead(memberId);
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('전체 읽음 처리에 실패했습니다.');
    }
  };

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!memberId) return;
    const prev = notifications;
    setNotifications([]);
    try {
      await apiDeleteAllNotifications(memberId);
    } catch (err) {
      setNotifications(prev);
      console.error(err);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  if (loading) return <NotificationLoader />;

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
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">{loadError}</div>
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
              // 안전 URL로 치환 + avatarKind 전달
              notification={{
                ...notification,
                userAvatar:
                  getSafeProfileUrl(notification.userAvatar) || DEFAULT_IMAGES.PROFILE,
              }}
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
