import React, { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { getSafeProfileUrl } from '@/utils/defaultImages';

interface HeaderProfileMenuProps {
  user: any;
  isAuthenticated: boolean;
  showProfileMenu: boolean;
  hasUnreadNotifications: boolean;
  unreadCount: number;
  variant: string;
  textColor: string;
  menuRootRef: RefObject<HTMLDivElement>;
  handleProfileMenuToggle: () => void;
  handleLoginClick: () => void;
  handleNotificationClick: () => void;
  handleMyPageClick: () => void;
  handleLogOut: () => void;
  safeProfileSrc: string;
}

const HeaderProfileMenu: React.FC<HeaderProfileMenuProps> = ({
  user,
  isAuthenticated,
  showProfileMenu,
  hasUnreadNotifications,
  unreadCount,
  variant,
  textColor,
  menuRootRef,
  handleProfileMenuToggle,
  handleLoginClick,
  handleNotificationClick,
  handleMyPageClick,
  handleLogOut,
  safeProfileSrc,
}) => {
  if (isAuthenticated) {
    return (
      <div ref={menuRootRef} className="relative flex">
        {/* 프로필 버튼 */}
        <button
          onClick={handleProfileMenuToggle}
          className={cn(
            'relative flex items-center space-x-2 p-2 rounded-lg',
            textColor,
            'hover:bg-opacity-70'
          )}
          aria-haspopup="menu"
          aria-expanded={showProfileMenu}
        >
          <div className="relative">
            <img
              key={safeProfileSrc}
              src={safeProfileSrc}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              draggable={false}
              onError={(e) => {
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
            role="menu"
            aria-label="사용자 메뉴"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={handleNotificationClick}
                className={cn(
                  'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg w-full text-left',
                  textColor
                )}
                role="menuitem"
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
                role="menuitem"
              >
                마이페이지
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogOut}
                className="block w-full text-left px-4 py-2 text-sm text-warning font-bold hover:bg-gray-100 hover:font-bold"
                role="menuitem"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link to="/login" onClick={handleLoginClick} className="px-4 py-2 text-sm hover:font-bold">
        로그인/회원가입
      </Link>
    </div>
  );
};

export default HeaderProfileMenu;

