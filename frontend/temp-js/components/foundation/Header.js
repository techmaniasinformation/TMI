import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'; // ✅ NEW: useRef 추가
import { cva } from 'class-variance-authority';
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
      transparent: 'bg-transparent text-dark-bg'
    },
    size: {
      default: 'py-1',
      compact: 'py-1'
    }
  },
  defaultVariants: {
    variant: 'light',
    size: 'default'
  }
});
const Header = ({
  variant = 'light',
  size = 'default'
}) => {
  const {
    user,
    prevPath,
    socialProvider,
    setUser,
    clearUser,
    setFollowUser,
    setFollowCompany,
    clearSocialLoginInfo,
    setPrevPath
  } = useUserStore();
  const {
    isDarkMode,
    toggleTheme
  } = useThemeStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const isAuthenticated = !!user;

  // ✅ NEW: 드롭다운 래퍼 ref (트리거+메뉴)
  const menuRootRef = useRef(null);
  useEffect(() => {
    if (isAuthenticated && user?.memberId) {
      fetch(`https://i13a509.p.ssafy.io/api/v1/notification?memberId=${user.memberId}&status=unread`, {
        method: 'GET',
        credentials: 'include'
      }).then(res => res.json()).then(data => {
        if (data?.status === 'SUCCESS') {
          const contentList = data.data?.content || [];
          setHasUnreadNotifications(contentList.length > 0);
          setUnreadCount(contentList.length);
        } else {
          setHasUnreadNotifications(false);
          setUnreadCount(0);
        }
      }).catch(err => {
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
        await fetch(`https://i13a509.p.ssafy.io/api/v1/auth/logout/${user?.memberId}/${socialProvider}`, {
          method: 'GET',
          credentials: 'include'
        });
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
  }, [user?.memberId, clearUser, setFollowUser, setFollowCompany, clearSocialLoginInfo, navigate, prevPath, setPrevPath, socialProvider]);
  const addToRecentSearches = useCallback(term => {
    setRecentSearches(prev => [term, ...prev.filter(item => item !== term)].slice(0, 5));
  }, []);
  const removeFromRecentSearches = useCallback(term => {
    if (term === '') setRecentSearches([]);else setRecentSearches(prev => prev.filter(item => item !== term));
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
    setShowProfileMenu(v => !v);
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

  // ✅ NEW: 바깥 클릭 & ESC로 닫기
  useEffect(() => {
    if (!showProfileMenu) return;
    const onPointerDown = e => {
      const root = menuRootRef.current;
      if (!root) return;
      if (!root.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    const onKey = e => {
      if (e.key === 'Escape') setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, {
      passive: true
    });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showProfileMenu]);

  // ✅ 안전한 프로필 URL (유효하지 않으면 기본 이미지로 대체)
  const safeProfileSrc = useMemo(() => getSafeProfileUrl(user?.memberProfileUrl), [user?.memberProfileUrl]);
  const textColor = variant === 'dark' ? 'text-white hover:font-bold hover:text-dark-bg' : 'text-dark-bg hover:font-bold';
  return /*#__PURE__*/React.createElement("header", {
    className: cn(headerVariants({
      variant,
      size
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center h-16"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "TMI Logo",
    className: "w-20 h-20"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold"
  }, "TMI"))), /*#__PURE__*/React.createElement(SearchBar, {
    addToRecentSearches: addToRecentSearches,
    recentSearches: recentSearches,
    removeFromRecentSearches: removeFromRecentSearches
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    className: "p-2 text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`
  })), isAuthenticated ?
  /*#__PURE__*/
  // ✅ NEW: ref 부착 (트리거+메뉴 감싸는 래퍼)
  React.createElement("div", {
    ref: menuRootRef,
    className: "relative flex"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleProfileMenuToggle,
    className: cn('relative flex items-center space-x-2 p-2 rounded-lg', textColor, 'hover:bg-opacity-70'),
    "aria-haspopup": "menu" // ✅ 접근성
    ,
    "aria-expanded": showProfileMenu // ✅ 접근성
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("img", {
    key: safeProfileSrc,
    src: safeProfileSrc,
    alt: "Profile",
    className: "w-8 h-8 rounded-full object-cover",
    draggable: false // ✅ 드래그 방지(의도치 않은 이동 방지)
    ,
    onError: e => {
      e.currentTarget.src = getSafeProfileUrl(null);
    }
  }), hasUnreadNotifications && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-0 right-0 block w-3 h-3 bg-warning rounded-full border-2 border-blue"
  })), /*#__PURE__*/React.createElement("span", {
    className: cn('text-sm font-medium hover:font-bold', variant === 'dark' ? 'text-white' : 'text-dark-bg')
  }, user?.nickname || '사용자'), /*#__PURE__*/React.createElement("i", {
    className: cn('fas text-xs', showProfileMenu ? 'fa-chevron-up text-bold text-prime-btn' : 'fa-chevron-down text-bold text-gray-500')
  })), showProfileMenu && /*#__PURE__*/React.createElement("div", {
    className: cn('absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-lg z-50', variant === 'dark' ? 'bg-dark-header border-light-header' : 'bg-light-header border-dark-header'),
    role: "menu",
    "aria-label": "\uC0AC\uC6A9\uC790 \uBA54\uB274"
    // ✅ 메뉴 내부 클릭은 닫히지 않도록 버블링 차단 (선택)
    ,
    onMouseDown: e => e.stopPropagation(),
    onTouchStart: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleNotificationClick,
    className: cn('flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg w-full text-left', textColor),
    role: "menuitem"
  }, /*#__PURE__*/React.createElement("span", null, "\uC54C\uB9BC \uD655\uC778"), hasUnreadNotifications && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-red-600 font-bold"
  }, unreadCount)), /*#__PURE__*/React.createElement("button", {
    onClick: handleMyPageClick,
    className: cn('flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg w-full text-left', textColor),
    role: "menuitem"
  }, "\uB9C8\uC774\uD398\uC774\uC9C0"), /*#__PURE__*/React.createElement("hr", {
    className: "my-1"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogOut,
    className: "block w-full text-left px-4 py-2 text-sm text-warning font-bold hover:bg-gray-100 hover:font-bold",
    role: "menuitem"
  }, "\uB85C\uADF8\uC544\uC6C3")))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/login",
    onClick: handleLoginClick,
    className: "px-4 py-2 text-sm hover:font-bold"
  }, "\uB85C\uADF8\uC778/\uD68C\uC6D0\uAC00\uC785")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: handleWritePost
  }, "\uAC8C\uC2DC\uAE00 \uC791\uC131")))));
};
export default Header;