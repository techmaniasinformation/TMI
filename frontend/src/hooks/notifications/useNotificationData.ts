import { useNotificationAdapter } from './useNotificationAdapter';
import { useNotificationLoader } from './useNotificationLoader';

interface UseNotificationDataProps {
  memberId: number | undefined;
  myProfileUrl?: string;
}

export function useNotificationData({ memberId, myProfileUrl }: UseNotificationDataProps) {
  // 분리된 커스텀 훅들 사용
  const { adapt } = useNotificationAdapter({ myProfileUrl });
  const { notifications, setNotifications, loading, loadError, load } = useNotificationLoader(memberId, adapt);

  return {
    notifications,
    setNotifications,
    loading,
    loadError,
    load,
  };
}
