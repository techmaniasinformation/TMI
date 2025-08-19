import { useState, useRef } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';

// 헤더 상태 관리 훅
export const useHeaderState = () => {
  const { user } = useUserStore();
  const { isDarkMode } = useThemeStore();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const menuRootRef = useRef<HTMLDivElement>(null);
  
  const isAuthenticated = !!user;

  return {
    // 상태
    user,
    isAuthenticated,
    showProfileMenu,
    hasUnreadNotifications,
    recentSearches,
    unreadCount,
    isDarkMode,
    menuRootRef,

    // 상태 설정
    setShowProfileMenu,
    setHasUnreadNotifications,
    setRecentSearches,
    setUnreadCount,
  };
};
