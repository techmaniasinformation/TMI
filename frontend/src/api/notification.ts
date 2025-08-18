// 알림 서비스 통합 인터페이스
// 기존 API 호환성을 위해 모든 함수를 재export

// 알림 관련 서비스
export {
  fetchNotifications,
  deleteNotification,
  deleteAllNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from './notification/notificationService';

// 타입 재export
export type {
  NotificationStatus,
  NotificationListResponse,
  NotificationItem,
  NotificationDeleteOneResponse,
  NotificationDeleteAllResponse,
  NotificationReadOneResponse,
  NotificationReadAllResponse,
} from '@/types/notification/notifications';
