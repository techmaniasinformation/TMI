import * as React from "react"
import { useAuth } from '@/hooks/store/useStoreActions';

interface HeaderProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

const HeaderProfileMenu: React.FC<HeaderProfileMenuProps> = ({
  isOpen,
  onClose,
  onLogout,
  onProfileClick,
}) => {
  const { user } = useAuth();

  if (!isOpen) return null

  return (
    <div
      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="py-1">
        <button
          onClick={onProfileClick}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          프로필
        </button>
        <button
          onClick={onLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export { HeaderProfileMenu }

