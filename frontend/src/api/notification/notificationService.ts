import { getRequest, patchRequest, deleteRequest } from './notificationApiClient';
import { handleNotificationError } from './notificationErrorHandler';
import type {
  NotificationStatus,
  NotificationListResponse,
  NotificationItem,
  NotificationDeleteOneResponse,
  NotificationDeleteAllResponse,
  NotificationReadOneResponse,
  NotificationReadAllResponse,
} from '@/types/notification/notifications';

// 알림 목록 조회
export async function fetchNotifications(
  memberId: number,
  status: NotificationStatus = 'all',
  opts?: { page?: number; size?: number }
): Promise<NotificationItem[]> {
  try {
    const params: Record<string, string | number> = {
      memberId,
      status
    };
    
    if (opts?.page != null) params.page = opts.page;
    if (opts?.size != null) params.size = opts.size;

    const data: NotificationListResponse = await getRequest<NotificationListResponse>('/notification', params);
    
    if (data.status !== 'SUCCESS') {
      throw new Error('알림 목록 조회 실패');
    }
    
    return data.data.content;
  } catch (error) {
    throw handleNotificationError(error, '알림 목록 조회 실패');
  }
}

// 개별 알림 삭제
export async function deleteNotification(
  notificationId: number,
  memberId: number
): Promise<NotificationDeleteOneResponse> {
  try {
    const data: NotificationDeleteOneResponse = await deleteRequest<NotificationDeleteOneResponse>(
      `/notification/${notificationId}`,
      { memberId }
    );
    
    if (data.status !== 'SUCCESS') {
      throw new Error('알림 삭제 실패');
    }
    
    return data;
  } catch (error) {
    throw handleNotificationError(error, '알림 삭제 실패');
  }
}

// 전체 알림 삭제
export async function deleteAllNotifications(
  memberId: number
): Promise<NotificationDeleteAllResponse> {
  try {
    const data: NotificationDeleteAllResponse = await deleteRequest<NotificationDeleteAllResponse>(
      '/notification/all',
      { memberId }
    );
    
    if (data.status !== 'SUCCESS') {
      throw new Error('전체 알림 삭제 실패');
    }
    
    return data;
  } catch (error) {
    throw handleNotificationError(error, '전체 알림 삭제 실패');
  }
}

// 개별 알림 읽음 처리
export async function markNotificationRead(
  notificationId: number
): Promise<NotificationReadOneResponse> {
  try {
    const data: NotificationReadOneResponse = await patchRequest<NotificationReadOneResponse>(
      `/notification/${notificationId}/read`
    );
    
    if (data.status !== 'SUCCESS') {
      throw new Error('알림 읽음 처리 실패');
    }
    
    return data;
  } catch (error) {
    throw handleNotificationError(error, '알림 읽음 처리 실패');
  }
}

// 전체 알림 읽음 처리
export async function markAllNotificationsRead(
  memberId: number
): Promise<NotificationReadAllResponse> {
  try {
    const data: NotificationReadAllResponse = await patchRequest<NotificationReadAllResponse>(
      '/notification/read/all',
      { memberId }
    );
    
    if (data.status !== 'SUCCESS') {
      throw new Error('전체 알림 읽음 처리 실패');
    }
    
    return data;
  } catch (error) {
    throw handleNotificationError(error, '전체 알림 읽음 처리 실패');
  }
}
