import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import SearchBar from './SearchBar';
import { Button } from './button';
import { useHeader } from '@/hooks/useHeader';
import HeaderLogo from './HeaderLogo';
import HeaderThemeToggle from './HeaderThemeToggle';
import HeaderProfileMenu from './HeaderProfileMenu';

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
    // 상태
    user,
    isAuthenticated,
    showProfileMenu,
    hasUnreadNotifications,
    recentSearches,
    unreadCount,
    isDarkMode,
    safeProfileSrc,
    menuRootRef,

    // 이벤트 핸들러
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
  } = useHeader();

  const textColor =
    variant === 'dark'
      ? 'text-white hover:font-bold hover:text-dark-bg'
      : 'text-dark-bg hover:font-bold';

  return (
    <header className={cn(headerVariants({ variant, size }))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <HeaderLogo />

          {/* 검색바 */}
          <SearchBar
            addToRecentSearches={addToRecentSearches}
            recentSearches={recentSearches}
            removeFromRecentSearches={removeFromRecentSearches}
          />

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 라이트/다크 토글 */}
            <HeaderThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* 프로필 메뉴 */}
            <HeaderProfileMenu
              user={user}
              isAuthenticated={isAuthenticated}
              showProfileMenu={showProfileMenu}
              hasUnreadNotifications={hasUnreadNotifications}
              unreadCount={unreadCount}
              variant={variant}
              textColor={textColor}
              menuRootRef={menuRootRef}
              handleProfileMenuToggle={handleProfileMenuToggle}
              handleLoginClick={handleLoginClick}
              handleNotificationClick={handleNotificationClick}
              handleMyPageClick={handleMyPageClick}
              handleLogOut={handleLogOut}
              safeProfileSrc={safeProfileSrc}
            />

            {/* 게시글 작성 버튼 */}
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

