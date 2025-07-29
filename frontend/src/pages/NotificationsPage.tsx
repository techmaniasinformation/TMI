import React, { useState, useEffect } from 'react';

// 페이지네이션 컴포넌트와 읽지 않은 알림만 보기 스위치를 가져오기
import Pagination from '@/components/domain/Pagination';
import UnreadOnlyToggle from '@/components/layout/notifications/UnreadToggle';

// 상단 버튼에 사용할 아이콘들
import TrashIcon from '@/assets/icons/trash.svg';
import CheckIcon from '@/assets/icons/check.svg';
import DeleteIcon from '@/assets/icons/graytrash.svg';

// 기본 프로필 이미지
import ExBadge from '@/assets/icons/exbadge.svg'
import ExPeople from '@/assets/icons/expeople.svg'
import ExCompany from '@/assets/icons/excompany.svg'

interface NotificationsPageProps {}

// 알림 데이터 구조를 정의
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

const NotificationsPage: React.FC<NotificationsPageProps> = () => {
  // 상태 정의: 알림 목록, 현재 페이지, 필터 상태, 로딩 상태
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5; // 한 페이지에 표시할 알림 수

  // 컴포넌트가 처음 렌더링될 때 알림 데이터를 가져옵니다.
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch('/notifications.json');
        if (!response.ok) throw new Error('네트워크 응답 실패');

        const data: Notification[] = await response.json();
        // 최신 알림이 위로 오도록 정렬
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

  // 날짜 문자열을 보기 쉬운 형식으로 변환
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR');
  };

  // 알림 타입별로 기본 프로필 이미지를 반환
  const getDefaultAvatar = (type: string): string => {
    switch (type) {
      case 'badge':
        return ExBadge;
      case 'comment':
        return ExPeople;
      case 'post':
        return ExCompany;
      default:
        return ExPeople;
    }
  };

  // 읽지 않은 알림만 보기 체크 여부에 따라 필터링
  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;

    // 현재 페이지 계산
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 클릭한 알림을 읽음 처리
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
  };

  // 개별 알림 삭제
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

  return (
    <div className="max-w-[848px] mx-auto">
      {/* 상단 툴바: 읽지 않은 알림만 보기, 전체 읽음/삭제 버튼 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <UnreadOnlyToggle
              checked={showUnreadOnly}
              onChange={setShowUnreadOnly}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-prime-btn text-white text-sm rounded-lg hover:bg-prime-btn-hover transition-colors">
              <img src={CheckIcon} alt="읽음" className="w-4 h-4 object-contain" />
              모두 읽음 표시
            </button>

            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
              <img src={TrashIcon} alt="삭제" className="w-4 h-4 object-contain" />
              전체 삭제
            </button>
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-4">
        {currentNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start space-x-4">
              {/* 프로필 이미지 또는 기본 아이콘 */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={notification.userAvatar ?? getDefaultAvatar(notification.type)}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 알림 메시지, 시간, 상태 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm mb-1 ${notification.isRead ? 'text-[#4b5563]' : 'text-gray-900'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 ml-4 h-6 pt-2">
                    {/* 안 읽은 알림이면 파란 점 */}
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    
                    {/* 개별 삭제 버튼 */}
                    <button
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <img src={DeleteIcon} alt="삭제" className="w-4 h-4 object-contain" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      
      {/* 알림이 없을 때 안내 메시지 */}
      {currentNotifications.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-bell text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showUnreadOnly ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </h3>
          <p className="text-gray-500">새로운 알림이 오면 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;