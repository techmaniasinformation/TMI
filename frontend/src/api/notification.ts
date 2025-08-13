// src/api/notification.ts
import type {
  NotificationStatus,
  NotificationListResponse,
  NotificationItem,
} from '@/types/notification/notificatios';

const BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 공통 fetch 헬퍼(선택)
async function assertOk(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ''}`);
  }
}

/**
 * 알림 목록 조회
 * - 예: GET /notification?memberId=6&status=all
 * - 필요 시 page/size 쿼리를 추가해도 서버가 무시하면 그대로 동작합니다.
 */
export async function fetchNotifications(
  memberId: number,
  status: NotificationStatus = 'all',
  opts?: { page?: number; size?: number } // 옵션(서버가 지원하면 사용)
): Promise<NotificationItem[]> {
  const url = new URL(`${BASE_URL}/notification`);
  url.searchParams.set('memberId', String(memberId));
  url.searchParams.set('status', status);
  if (opts?.page != null) url.searchParams.set('page', String(opts.page));
  if (opts?.size != null) url.searchParams.set('size', String(opts.size));

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include', // ★ 세션/쿠키 기반이면 필수
    headers: { Accept: 'application/json' },
  });
  await assertOk(res);

  const data = (await res.json()) as NotificationListResponse;
  if (data.status !== 'SUCCESS') {
    throw new Error('알림 목록 조회 실패');
  }
  return data.data.content;
}
