import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { ROUTES } from '@/utils/navigation';

interface UseHeaderActionsProps {
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  menuRootRef: React.RefObject<HTMLDivElement | null>;
}

export function useHeaderActions({
  showProfileMenu,
  setShowProfileMenu,
  menuRootRef,
}: UseHeaderActionsProps) {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();

  // 프로필 메뉴 토글
  const handleProfileMenuToggle = useCallback(() => {
    setShowProfileMenu(!showProfileMenu);
  }, [showProfileMenu, setShowProfileMenu]);

  // 로그인 클릭
  const handleLoginClick = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  // 알림 클릭
  const handleNotificationClick = useCallback(() => {
    navigate(ROUTES.NOTIFICATIONS);
  }, [navigate]);

  // 마이페이지 클릭
  const handleMyPageClick = useCallback(() => {
    navigate(ROUTES.MY_PAGE);
  }, [navigate]);

  // 로그아웃
  const handleLogOut = useCallback(async () => {
    try {
      clearUser();
      setShowProfileMenu(false);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }, [clearUser, setShowProfileMenu, navigate]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent | TouchEvent) => {
      if (menuRootRef.current && !menuRootRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside as any);
      document.addEventListener('touchstart', handleClickOutside as any);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
      document.removeEventListener('touchstart', handleClickOutside as any);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showProfileMenu, setShowProfileMenu, menuRootRef]);

  return {
    handleProfileMenuToggle,
    handleLoginClick,
    handleNotificationClick,
    handleMyPageClick,
    handleLogOut,
  };
}
