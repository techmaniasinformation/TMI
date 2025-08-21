import { useCallback } from 'react';
import { useBadgeImages } from './useBadgeImages';
import { DEFAULT_IMAGES } from '@/utils/defaultImages';

interface NotificationAdapterProps {
  myProfileUrl?: string;
}

export function useNotificationAdapter({ myProfileUrl }: NotificationAdapterProps) {
  const { badgeImages, resolveBadgeSrc } = useBadgeImages();

  // 서버 응답 → 화면 모델 매핑 (+ avatarKind 설정)
  const adapt = useCallback(
    (srv: any): any => {
      let mappedType: 'post' | 'comment' | 'badge' = 'post';
      switch (srv.notificationType) {
        case 'BADGE_ACQUIRED':
          mappedType = 'badge';
          break;
        case 'NEW_COMMENT':
          mappedType = 'comment';
          break;
        case 'MEMBER_NEW_POST':
        default:
          mappedType = 'post';
      }

      let avatar: string | undefined;
      let avatarKind: 'PROFILE' | 'BADGE' | 'COMPANY' = 'PROFILE';

      if (mappedType === 'badge') {
        const local = badgeImages[srv.badgeUrl as string];
        avatar = local ?? resolveBadgeSrc(srv.badgeUrl);
        avatarKind = 'BADGE';
      } else if (mappedType === 'comment') {
        // 댓글 알림: 사람으로 취급
        avatar = cleanUrl(myProfileUrl);
        avatarKind = 'PROFILE';
      } else {
        // 게시글 알림: 사람/회사 중 무엇이 있는지로 구분
        const memberUrl = cleanUrl(srv.memberProfileUrl);
        const companyUrl = cleanUrl(srv.companyProfileUrl);
        if (memberUrl) {
          avatar = memberUrl;
          avatarKind = 'PROFILE';
        } else if (companyUrl) {
          avatar = companyUrl;
          avatarKind = 'COMPANY';
        } else {
          avatar = undefined;
          avatarKind = 'PROFILE';
        }
      }

      return {
        id: String(srv.notificationId),
        type: mappedType,
        message: srv.content ?? '',
        timestamp: srv.createdAt ?? '',
        isRead: !!srv.isRead,
        postId: srv.postId != null ? String(srv.postId) : undefined,
        badgeType:
          mappedType === 'badge'
            ? badgeImages[srv.badgeUrl as string] ?? resolveBadgeSrc(srv.badgeUrl)
            : undefined,
        userAvatar: avatar,
        userId: srv.memberId != null ? String(srv.memberId) : undefined,
        userName: srv.nickname ?? srv.companyName ?? undefined,
        avatarKind,
      };
    },
    [myProfileUrl, badgeImages, resolveBadgeSrc]
  );

  return { adapt };
}

// URL 정리 헬퍼
function cleanUrl(url?: string | null): string | undefined {
  if (!url || url === 'null' || url === 'undefined') return undefined;
  return url.trim() || undefined;
}
