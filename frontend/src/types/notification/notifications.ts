export type NotificationStatus = 'all' | 'read' | 'unread';

export type NotificationType =
  | 'BADGE_ACQUIRED'
  | 'NEW_COMMENT'
  | 'NEW_POST'      // 필요시 확장
  | (string & {});  // 서버가 추가해도 깨지지 않게

export interface NotificationItem {
  notificationId: number;
  notificationType: NotificationType;
  content: string;
  postId: number | null;
  badgeUrl: string | null;
  memberProfileUrl: string | null;
  companyProfileUrl: string | null;
  isRead: boolean;
  createdAt: string; // ISO
}

/** 목록 조회 응답 */
export interface NotificationListResponse {
  status: 'SUCCESS' | 'ERROR';
  data: {
    content: NotificationItem[];
  };
}

/** 개별 삭제 응답 */
export interface NotificationDeleteOneResponse {
  status: 'SUCCESS' | 'ERROR';
  data: { deletedId: number };
}

/** 전체 삭제 응답 */
export interface NotificationDeleteAllResponse {
  status: 'SUCCESS' | 'ERROR';
  data: { deletedCount: number };
}

/** 개별 읽음 처리 응답 */
export interface NotificationReadOneResponse {
  status: 'SUCCESS' | 'ERROR';
  data: { notificationId: number };
}

/** 전체 읽음 처리 응답 */
export interface NotificationReadAllResponse {
  status: 'SUCCESS' | 'ERROR';
  data: { updatedIds: number[] }; // 서버 예시가 빈 배열이었음
}
