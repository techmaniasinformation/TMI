import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';
import type { useHeaderState } from './useHeaderState';

// 헤더 액션 훅
export const useHeaderActions = (state: ReturnType<typeof useHeaderState>) => {
  const { user, isAuthenticated, showProfileMenu, setShowProfileMenu, setRecentSearches, menuRootRef } = state;
  
  const {
    prevPath,
    socialProvider,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
    setPrevPath,
  } = useUserStore();
  
  const { toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 로그아웃 처리
  const handleLogOut = useCallback(async () => {
    try {
      setPrevPath(window.location.pathname + window.location.search);
      if (socialProvider === 'google') {
        await fetch(
          `https://i13a509.p.ssafy.io/api/v1/auth/logout/${user?.memberId}/${socialProvider}`,
          { method: 'GET', credentials: 'include' }
        );
      } else {
        window.location.href = `https://i13a509.p.ssafy.io/api/v1/auth/logout/${user?.memberId}/${socialProvider}`;
      }

      clearUser();
      setFollowUser([]);
      setFollowCompany([]);
      clearSocialLoginInfo();
      setShowProfileMenu(false);

      navigate(prevPath);
      alert('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      setPrevPath(window.location.pathname + window.location.search);
      clearUser();
      setFollowUser([]);
      setFollowCompany([]);
      clearSocialLoginInfo();
      setShowProfileMenu(false);
      alert('로그아웃 되었습니다.');
      navigate(prevPath);
    }
  }, [
    user?.memberId,
    socialProvider,
    prevPath,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
    setShowProfileMenu,
    navigate,
    setPrevPath,
  ]);

  // 최근 검색어 관리
  const addToRecentSearches = useCallback((term: string) => {
    setRecentSearches((prev) => [term, ...prev.filter((item) => item !== term)].slice(0, 5));
  }, [setRecentSearches]);

  const removeFromRecentSearches = useCallback((term: string) => {
    if (term === '') setRecentSearches([]);
    else setRecentSearches((prev) => prev.filter((item) => item !== term));
  }, [setRecentSearches]);

  // 게시글 작성
  const handleWritePost = useCallback(() => {
    if (!isAuthenticated) {
      setPrevPath('/post/create');
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/post/create');
    }
  }, [isAuthenticated, setPrevPath, navigate]);

  // 프로필 메뉴 토글
  const handleProfileMenuToggle = useCallback(() => {
    setShowProfileMenu((v) => !v);
  }, [setShowProfileMenu]);

  // 로그인 클릭
  const handleLoginClick = useCallback(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      setPrevPath(location.pathname + location.search);
    }
  }, [location.pathname, location.search, setPrevPath]);

  // 알림 클릭
  const handleNotificationClick = useCallback(() => {
    setShowProfileMenu(false);
    navigate('/notifications');
  }, [setShowProfileMenu, navigate]);

  // 마이페이지 클릭
  const handleMyPageClick = useCallback(() => {
    setShowProfileMenu(false);
    navigate('/my-page');
  }, [setShowProfileMenu, navigate]);

  // 바깥 클릭 & ESC로 메뉴 닫기
  useEffect(() => {
    if (!showProfileMenu) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const root = menuRootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowProfileMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showProfileMenu, menuRootRef, setShowProfileMenu]);

  return {
    // 액션
    handleLogOut,
    handleWritePost,
    handleProfileMenuToggle,
    handleLoginClick,
    handleNotificationClick,
    handleMyPageClick,
    toggleTheme,

    // 검색 관련
    addToRecentSearches,
    removeFromRecentSearches,
  };
};
