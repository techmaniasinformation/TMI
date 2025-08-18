// src/api/notification.ts
import type {
  NotificationStatus,
  NotificationListResponse,
  NotificationItem,
  NotificationDeleteOneResponse,
  NotificationDeleteAllResponse,
  NotificationReadOneResponse,
  NotificationReadAllResponse,
} from '@/types/notification/notifications';

const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

async function assertOk(response: Response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}${text ? ` - ${text}` : ''}`);
  }
}

/** 알림 목록 조회
 * GET /notification?memberId={id}&status=all|read|unread
 */
export async function fetchNotifications(
  memberId: number,
  status: NotificationStatus = 'all',
  opts?: { page?: number; size?: number } // 서버가 지원하면 사용
): Promise<NotificationItem[]> {
  const url = new URL(`${BASE_URL}/notification`);
  url.searchParams.set('memberId', String(memberId));
  url.searchParams.set('status', status);
  if (opts?.page != null) url.searchParams.set('page', String(opts.page));
  if (opts?.size != null) url.searchParams.set('size', String(opts.size));

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',          // 세션/쿠키 인증일 때
    headers: { Accept: 'application/json' },
  });
  await assertOk(response);

  const data = (await response.json()) as NotificationListResponse;
  if (data.status !== 'SUCCESS') throw new Error('알림 목록 조회 실패');
  return data.data.content;
}

/** 개별 알림 삭제
 * DELETE /notification/{notificationId}?memberId={id}
 */
export async function deleteNotification(
  notificationId: number,
  memberId: number
): Promise<NotificationDeleteOneResponse> {
  const url = new URL(`${BASE_URL}/notification/${notificationId}`);
  url.searchParams.set('memberId', String(memberId));

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include',
  });
  await assertOk(response);

  const data = (await response.json()) as NotificationDeleteOneResponse;
  if (data.status !== 'SUCCESS') throw new Error('알림 삭제 실패');
  return data;
}

/** 전체 알림 삭제
 * DELETE /notification/all?memberId={id}
 */
export async function deleteAllNotifications(
  memberId: number
): Promise<NotificationDeleteAllResponse> {
  const url = new URL(`${BASE_URL}/notification/all`);
  url.searchParams.set('memberId', String(memberId));

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include',
  });
  await assertOk(response);

  const data = (await response.json()) as NotificationDeleteAllResponse;
  if (data.status !== 'SUCCESS') throw new Error('전체 알림 삭제 실패');
  return data;
}

/** 개별 알림 읽음 처리
 * PATCH /notification/{notificationId}/read
 */
export async function markNotificationRead(
  notificationId: number
): Promise<NotificationReadOneResponse> {
  const response = await fetch(`${BASE_URL}/notification/${notificationId}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });
  await assertOk(response);

  const data = (await response.json()) as NotificationReadOneResponse;
  if (data.status !== 'SUCCESS') throw new Error('알림 읽음 처리 실패');
  return data;
}

/** 전체 알림 읽음 처리
 * PATCH /notification/read/all?memberId={id}
 */
export async function markAllNotificationsRead(
  memberId: number
): Promise<NotificationReadAllResponse> {
  const url = new URL(`${BASE_URL}/notification/read/all`);
  url.searchParams.set('memberId', String(memberId));

  const res = await fetch(url.toString(), {
    method: 'PATCH',
    credentials: 'include',
  });
  await assertOk(res);

  const data = (await res.json()) as NotificationReadAllResponse;
  if (data.status !== 'SUCCESS') throw new Error('전체 알림 읽음 처리 실패');
  return data;
}
