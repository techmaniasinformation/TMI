// NotificationsPage.tsx
import React, { useState, useEffect } from 'react';

// 테스트 후 나중에 지울 것들
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

// 만든 다른 컴포넌트들
import Pagination from '@/components/domain/Pagination';
import NotificationItem from '@/components/layout/notifications/NotifiactionItem';
import NotificationToolbar from '@/components/layout/notifications/NotifiactionToolbar';
import NoNotifications from '@/components/layout/notifications/NoNotifications';
import NotificationLoader from '@/components/layout/notifications/NotificationLoader';

// 알림 하나하나의 정보가 어떻게 생겼는지 알려주는 인터페이스
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
  // 알림 목록을 저장할 공간
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // 몇 번째 페이지를 보고 있는지
  const [currentPage, setCurrentPage] = useState(1);
  // 읽지 않은 것만 보기로 체크했는지
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  // 데이터를 불러오는 중인지 확인용
  const [loading, setLoading] = useState(false);
  // 한 페이지에 5개씩 보여줌
  const itemsPerPage = 5;


  // 지울 거
  const navigate = useNavigate(); // ✅ 네비게이션 훅 추가

  // 처음 페이지 열었을 때 알림 목록 불러오기
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch('/notifications.json');
        if (!response.ok) throw new Error('네트워크 응답 실패');

        const data: Notification[] = await response.json();
        // 최근 순으로 정렬
        const sorted = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(sorted);
      } catch (error) {
        console.error('알림 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 읽지 않은 것만 보기 체크하면 필터링
  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;

  // 몇 페이지가 필요한지 계산
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  // 현재 페이지에서 보여줄 알림 시작 번호
  const startIndex = (currentPage - 1) * itemsPerPage;
  // 현재 페이지에 보여줄 알림만 잘라서 저장
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  // 알림을 클릭했을 때 읽음 처리
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
  };

  // 알림 삭제 (X 버튼 눌렀을 때)
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // 모든 알림 삭제
  const handleDeleteAll = () => {
    setNotifications([]);
  };

  // 로딩 중이면 로딩 화면만 보여주기
  if (loading) return <NotificationLoader />;

  return (
    <div className="max-w-[848px] mx-auto">
      {/* 위쪽 도구 모음 (읽음/삭제/필터) */}
      <NotificationToolbar
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={setShowUnreadOnly}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAll={handleDeleteAll}
      />

      {/* 알림 목록 */}
      <div className="space-y-4">
        {currentNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
            onDelete={handleDeleteNotification}
          />
        ))}
      </div>
      
      {/* 페이지 넘기기 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 알림이 하나도 없을 때 메시지 */}
      {currentNotifications.length === 0 && (
        <NoNotifications showUnreadOnly={showUnreadOnly} />
      )}

      {/* 지울 것들       */}
      {/* ✅ 마이페이지 이동 버튼 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => navigate(ROUTES.MY_PAGE)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🙋 내 마이페이지
        </button>
        <button
          onClick={() => navigate(ROUTES.MY_PAGE_COMPANY)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          🏢 기업 마이페이지
        </button>
        <button
          onClick={() => navigate(ROUTES.MY_PAGE_USER)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          👤 타인 마이페이지
        </button>
      </div>

    </div>
  );
};

export default NotificationsPage;
