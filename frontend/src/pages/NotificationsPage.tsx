import React, { useState, useEffect } from 'react';

import ClientPagination from '@/components/domain/ClientPagination';
import NotificationItem from '@/components/layout/notifications/NotifiactionItem';
import NotificationToolbar from '@/components/layout/notifications/NotifiactionToolbar';
import NoNotifications from '@/components/layout/notifications/NoNotifications';
import NotificationLoader from '@/components/layout/notifications/NotificationLoader';

import { useAuth } from '@/hooks/store/useStoreActions';
import { useNotificationData } from '@/hooks/notifications/useNotificationData';
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';
import { getSafeProfileUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const memberId = user?.memberId;
  const myProfileUrl = user?.memberProfileUrl ?? undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const itemsPerPage = 5;

  // 커스텀 훅들 사용
  const { notifications, setNotifications, loading, loadError, load } = useNotificationData({
    memberId,
    myProfileUrl
  });
  const {
    handleNotificationClick,
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleDeleteAll,
  } = useNotificationActions(memberId, notifications, setNotifications);

  useEffect(() => {
    load(showUnreadOnly);
  }, [load, showUnreadOnly]);

  if (loading) return <NotificationLoader />;

  const filteredNotifications = notifications;

  return (
    <div className="max-w-[848px] mx-auto bg-light-bg dark:bg-dark-bg">
      <NotificationToolbar
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={setShowUnreadOnly}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAll={handleDeleteAll}
      />

      {loadError && (
        <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm">{loadError}</div>
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
