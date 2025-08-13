import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Button } from './button';
import { useThemeStore } from '@/stores/themeStore';
import { useUserStore } from '@/stores/userStore';

import logo from '@/assets/icons/tmiLogo.svg';
import { getSafeProfileUrl } from '@/utils/defaultImages';

const headerVariants = cva('text-white', {
  variants: {
    variant: {
      light: 'bg-light-header text-dark-bg',
      dark: 'bg-dark-header text-white',
      transparent: 'bg-transparent text-dark-bg',
    },
    size: {
      default: 'py-1',
      compact: 'py-1',
    },
  },
  defaultVariants: {
    variant: 'light',
    size: 'default',
  },
});

interface HeaderProps extends VariantProps<typeof headerVariants> {}

const Header: React.FC<HeaderProps> = ({ variant = 'light', size = 'default' }) => {
  const {
    user,
    prevPath,
    socialProvider,
    setUser,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
    setPrevPath,
  } = useUserStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated && user?.memberId) {
      fetch(
        `https://i13a509.p.ssafy.io/api/v1/notification?memberId=${user.memberId}&status=unread`,
        { method: 'GET', credentials: 'include' }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.status === 'SUCCESS') {
            const contentList = data.data?.content || [];
            setHasUnreadNotifications(contentList.length > 0);
            setUnreadCount(contentList.length);
          } else {
            setHasUnreadNotifications(false);
            setUnreadCount(0);
          }
        })
        .catch((err) => {
          console.error('알림 조회 실패:', err);
          setHasUnreadNotifications(false);
          setUnreadCount(0);
        });
    }
  }, [isAuthenticated, user?.memberId]);

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
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
    navigate,
    prevPath,
    setPrevPath,
    socialProvider,
  ]);

  const addToRecentSearches = useCallback((term: string) => {
    setRecentSearches((prev) => [term, ...prev.filter((item) => item !== term)].slice(0, 5));
  }, []);

  const removeFromRecentSearches = useCallback((term: string) => {
    if (term === '') setRecentSearches([]);
    else setRecentSearches((prev) => prev.filter((item) => item !== term));
  }, []);

  const handleWritePost = useCallback(() => {
    if (!isAuthenticated) {
      setPrevPath('/post/create');
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/post/create');
    }
  }, [isAuthenticated, setPrevPath, navigate]);

  const handleProfileMenuToggle = useCallback(() => {
    setShowProfileMenu((v) => !v);
  }, []);

  const handleLoginClick = useCallback(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      setPrevPath(location.pathname + location.search);
    }
  }, [location.pathname, location.search, setPrevPath]);

  const handleNotificationClick = () => {
    setShowProfileMenu(false);
    navigate('/notifications');
  };

  const handleMyPageClick = () => {
    setShowProfileMenu(false);
    navigate('/my-page');
  };

  // ✅ 안전한 프로필 URL (유효하지 않으면 기본 이미지로 대체)
  const safeProfileSrc = useMemo(
    () => getSafeProfileUrl(user?.memberProfileUrl),
    [user?.memberProfileUrl]
  );

  const textColor =
    variant === 'dark'
      ? 'text-white hover:font-bold hover:text-dark-bg'
      : 'text-dark-bg hover:font-bold';

  return (
    <header className={cn(headerVariants({ variant, size }))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="TMI Logo" className="w-20 h-20" />
              <span className="text-xl font-bold">TMI</span>
            </Link>
          </div>

          {/* 검색바 */}
          <SearchBar
            addToRecentSearches={addToRecentSearches}
            recentSearches={recentSearches}
            removeFromRecentSearches={removeFromRecentSearches}
          />

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative flex">
                {/* 프로필 */}
                <button
                  onClick={handleProfileMenuToggle}
                  className={cn(
                    'relative flex items-center space-x-2 p-2 rounded-lg',
                    textColor,
                    'hover:bg-opacity-70'
                  )}
                >
                  <div className="relative">
                    <img
                      key={safeProfileSrc}
                      src={safeProfileSrc}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // 네트워크/404 시 최종 폴백
                        (e.currentTarget as HTMLImageElement).src = getSafeProfileUrl(null);
                      }}
                    />
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 block w-3 h-3 bg-warning rounded-full border-2 border-blue"></span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hover:font-bold',
                      variant === 'dark' ? 'text-white' : 'text-dark-bg'
                    )}
                  >
                    {user?.nickname || '사용자'}
                  </span>
                  <i
                    className={cn(
                      'fas text-xs',
                      showProfileMenu
                        ? 'fa-chevron-up text-bold text-prime-btn'
                        : 'fa-chevron-down text-bold text-gray-500'
                    )}
                  ></i>
                </button>

                {/* 프로필 메뉴 */}
                {showProfileMenu && (
                  <div
                    className={cn(
                      'absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-lg z-50',
                      variant === 'dark'
                        ? 'bg-dark-header border-light-header'
                        : 'bg-light-header border-dark-header'
                    )}
                  >
                    <div className="py-1">
                      <button
                        onClick={handleNotificationClick}
                        className={cn(
                          'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg w-full text-left',
                          textColor
                        )}
                      >
                        <span>알림 확인</span>
                        {hasUnreadNotifications && (
                          <span className="ml-2 text-red-600 font-bold">{unreadCount}</span>
                        )}
                      </button>
                      <button
                        onClick={handleMyPageClick}
                        className={cn(
                          'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg w-full text-left',
                          textColor
                        )}
                      >
                        마이페이지
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogOut}
                        className="block w-full text-left px-4 py-2 text-sm text-warning font-bold hover:bg-gray-100 hover:font-bold"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" onClick={handleLoginClick} className="px-4 py-2 text-sm hover:font-bold">
                  로그인/회원가입
                </Link>
              </div>
            )}
            <Button variant="primary" onClick={handleWritePost}>
              게시글 작성
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
