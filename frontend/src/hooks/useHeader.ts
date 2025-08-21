import { useMemo } from 'react';
import { getSafeProfileUrl } from '@/utils/defaultImages';
import { useHeaderState } from './header/useHeaderState';
import { useHeaderNotifications } from './header/useHeaderNotifications';
import { useHeaderActions } from './header/useHeaderActions';

// 헤더 훅
export const useHeader = () => {
  const state = useHeaderState();
  const actions = useHeaderActions(state);
  
  // 알림 관련 로직 실행
  useHeaderNotifications(state);

  // 안전한 프로필 URL
  const safeProfileSrc = useMemo(
    () => getSafeProfileUrl(state.user?.memberProfileUrl),
    [state.user?.memberProfileUrl]
  );

  return {
    // 상태
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    showProfileMenu: state.showProfileMenu,
    recentSearches: state.recentSearches,
    safeProfileSrc,
    menuRootRef: state.menuRootRef,

    // 이벤트 핸들러
    handleLogOut: actions.handleLogOut,
    handleProfileMenuToggle: actions.handleProfileMenuToggle,
    handleLoginClick: actions.handleLoginClick,
    handleNotificationClick: actions.handleNotificationClick,
    handleMyPageClick: actions.handleMyPageClick,
  };
};

