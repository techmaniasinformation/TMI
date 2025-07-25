// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NotificationsPageProps {}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = Array.from({ length: 3 }, (_, index) => {
      const types = ['badge', 'comment', 'post'];
      const type = types[index % 3];
      const isRead = index % 2 === 0;
      const date = new Date('2025-01-18T10:30:00Z');
      date.setHours(date.getHours() - index);
      
      const baseNotification = {
        id: (index + 1).toString(),
        type: type as 'badge' | 'comment' | 'post',
        message: '',
        timestamp: date.toISOString(),
        isRead: isRead,
      };

      switch (type) {
        case 'badge':
          return {
            ...baseNotification,
            message: `${index % 2 === 0 ? '우수 성과' : '커뮤니티 기여자'} 배지를 획득하셨습니다`,
            badgeType: index % 2 === 0 ? '우수 성과' : '커뮤니티 기여자'
          };
        case 'comment':
          return {
            ...baseNotification,
            message: `${['김민수', '이지영', '박서준'][index % 3]}님이 회원님의 게시물에 댓글을 남겼습니다`,
            userId: `user${index}`,
            userName: ['김민수', '이지영', '박서준'][index % 3],
            userAvatar: `https://readdy.ai/api/search-image?query=professional%20business%20person%20headshot%20portrait%20with%20clean%20white%20background%20modern%20corporate%20style%20high%20quality%20photography&width=40&height=40&seq=avatar${index}&orientation=squarish`,
            postId: `post${index}`
          };
        case 'post':
          return {
            ...baseNotification,
            message: `${['테크코리아', '이노베이션랩스', '퓨처테크'][index % 3]}가 새로운 게시물을 공유했습니다`,
            userId: `company${index}`,
            userName: ['테크코리아', '이노베이션랩스', '퓨처테크'][index % 3],
            userAvatar: `https://readdy.ai/api/search-image?query=modern%20technology%20company%20logo%20icon%20clean%20minimalist%20design%20corporate%20branding&width=40&height=40&seq=avatar${index}&orientation=squarish`,
            postId: `post${index}`
          };
        default:
          return baseNotification;
      }
    });
    setNotifications(mockNotifications);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return 'fas fa-trophy';
      case 'comment':
        return 'fas fa-comment';
      case 'post':
        return 'fas fa-file-alt';
      default:
        return 'fas fa-bell';
    }
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">알림</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="unread-only"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="unread-only" className="text-sm text-gray-700">
                  읽지 않은 알림만
                </label>
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                모두 읽음 처리
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                모두 삭제
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>전체 {notifications.length}개</span>
            <span>읽지 않은 {unreadCount}개</span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === 'badge' ? 'bg-yellow-100' :
                    notification.type === 'comment' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <i className={`${getNotificationIcon(notification.type)} ${
                      notification.type === 'badge' ? 'text-yellow-600' :
                      notification.type === 'comment' ? 'text-blue-600' : 'text-green-600'
                    }`}></i>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  {notification.userName && (
                    <div className="flex items-center space-x-2 mt-2">
                      <img
                        src={notification.userAvatar}
                        alt={notification.userName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-600">{notification.userName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {/* Empty State */}
        {currentNotifications.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-bell text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {showUnreadOnly ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </h3>
            <p className="text-gray-500">
              새로운 알림이 오면 여기에 표시됩니다.
            </p>
          </div>
        )}
      </div>
  );
};

export default NotificationsPage;