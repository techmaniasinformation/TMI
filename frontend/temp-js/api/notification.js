// src/api/notification.ts

const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';
async function assertOk(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ''}`);
  }
}

/** 알림 목록 조회
 * GET /notification?memberId={id}&status=all|read|unread
 */
export async function fetchNotifications(memberId, status = 'all', opts) {
  const url = new URL(`${BASE_URL}/notification`);
  url.searchParams.set('memberId', String(memberId));
  url.searchParams.set('status', status);
  if (opts?.page != null) url.searchParams.set('page', String(opts.page));
  if (opts?.size != null) url.searchParams.set('size', String(opts.size));
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    // 세션/쿠키 인증일 때
    headers: {
      Accept: 'application/json'
    }
  });
  await assertOk(res);
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error('알림 목록 조회 실패');
  return data.data.content;
}

/** 개별 알림 삭제
 * DELETE /notification/{notificationId}?memberId={id}
 */
export async function deleteNotification(notificationId, memberId) {
  const url = new URL(`${BASE_URL}/notification/${notificationId}`);
  url.searchParams.set('memberId', String(memberId));
  const res = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include'
  });
  await assertOk(res);
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error('알림 삭제 실패');
  return data;
}

/** 전체 알림 삭제
 * DELETE /notification/all?memberId={id}
 */
export async function deleteAllNotifications(memberId) {
  const url = new URL(`${BASE_URL}/notification/all`);
  url.searchParams.set('memberId', String(memberId));
  const res = await fetch(url.toString(), {
    method: 'DELETE',
    credentials: 'include'
  });
  await assertOk(res);
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error('전체 알림 삭제 실패');
  return data;
}

/** 개별 알림 읽음 처리
 * PATCH /notification/{notificationId}/read
 */
export async function markNotificationRead(notificationId) {
  const res = await fetch(`${BASE_URL}/notification/${notificationId}/read`, {
    method: 'PATCH',
    credentials: 'include'
  });
  await assertOk(res);
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error('알림 읽음 처리 실패');
  return data;
}

/** 전체 알림 읽음 처리
 * PATCH /notification/read/all?memberId={id}
 */
export async function markAllNotificationsRead(memberId) {
  const url = new URL(`${BASE_URL}/notification/read/all`);
  url.searchParams.set('memberId', String(memberId));
  const res = await fetch(url.toString(), {
    method: 'PATCH',
    credentials: 'include'
  });
  await assertOk(res);
  const data = await res.json();
  if (data.status !== 'SUCCESS') throw new Error('전체 알림 읽음 처리 실패');
  return data;
}