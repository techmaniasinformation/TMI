export type NotificationStatus = 'all' | 'read' | 'unread';

// 서버에서 내려오는 알림 타입들 (필요시 확장)
export type NotificationType =
  | 'BADGE_ACQUIRED'
  | 'NEW_COMMENT';

export interface NotificationItem {
  notificationId: number;
  notificationType: NotificationType;
  content: string;
  postId: number | null;
  badgeUrl: string | null;
  memberProfileUrl: string | null;
  companyProfileUrl: string | null;
  isRead: boolean;
  createdAt: string; // ISO string (예: "2025-08-12T14:58:11")
}

export interface NotificationListResponse {
  status: 'SUCCESS' | 'ERROR';
  data: {
    content: NotificationItem[];
  };
}
