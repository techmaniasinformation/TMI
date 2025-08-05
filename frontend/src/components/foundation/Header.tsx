import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar"; // 검색바 컴포넌트 분리
import { Button } from "./button";
import { useThemeStore } from "@/stores/themeStore"; // 테마 불러오기

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

const Header: React.FC<HeaderProps> = ({
  variant = 'light',
  size = 'default',
}) => {
  // 로그인 여부 확인
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { isDarkMode, toggleTheme } = useThemeStore(); // 전역 상태 사용
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLogin = () => setIsLoggedIn(!isLoggedIn);
  // const handleThemeToggle = () => setIsDarkMode(!isDarkMode);

  const addToRecentSearches = (term: string) => {
    setRecentSearches((prev) =>
      [term, ...prev.filter((item) => item !== term)].slice(0, 5)
    );
  };

  const removeFromRecentSearches = (term: string) => {
    if (term === '') {
      setRecentSearches([]);
    } else {
      setRecentSearches((prev) => prev.filter((item) => item !== term));
    }
  };

  // ✅ 게시글 작성 버튼 클릭시 로그인 여부에 따라 반응
  const handleWritePost = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.'); // 알림 표시
      navigate('/login'); // 로그인 페이지로 이동
    } else {
      navigate('/posts/editor'); // 게시글 작성 페이지로 이동 (예: /write)
    }
  };

  // variant에 따른 텍스트 색상 정의
  const textColor =
    variant === 'dark'
      ? 'text-white hover:font-bold hover:text-dark-bg'
      : 'text-dark-bg hover:font-bold';

  return (
    <header className={cn(headerVariants({ variant, size }))}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* 로고 */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <img
                src='src/assets/icons/tmiLogo.svg'
                alt='TMI Logo'
                className='w-20 h-20'
              />
              <span className='text-xl font-bold'>TMI</span>
            </Link>
          </div>

          {/* 검색바 */}
          <SearchBar
            addToRecentSearches={addToRecentSearches}
            recentSearches={recentSearches}
            removeFromRecentSearches={removeFromRecentSearches}
          />

          {/* 우측 메뉴 */}
          <div className='flex items-center space-x-4'>
            {/* 라이트/다크 토글 */}
            <button
              onClick={toggleTheme}
              className='p-2 text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center'
            >
              <i
                className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}
              />
            </button>
            {/* 로그인 여부에 따라 다르게 */}
            {isLoggedIn ? (
              <div className='relative flex'>
                {/* 프로필 */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={cn(
                    'relative flex items-center space-x-2 p-2 rounded-lg',
                    textColor, 
                    'hover:bg-opacity-70'
                  )}
                >
                  <div className='relative'>
                    <img
                      src='https://readdy.ai/api/search-image?query=professional%20headshot%20developer&width=32&height=32&orientation=squarish'
                      alt='Profile'
                      className='w-8 h-8 rounded-full'
                    />
                    {/* 알림 뱃지 */}
                    {hasUnreadNotifications && (
                      <span className='absolute top-0 right-0 block w-3 h-3 bg-warning rounded-full border-2 border-blue'></span>
                    )}
                  </div>
                  <span 
  className={cn(
    'text-sm font-medium hover:font-bold', // 기본 크기와 두께
    variant === 'dark' ? 'text-white' : 'text-dark-bg', 
  )}
>
  김개발
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
                      // 테마 적용
                      variant === 'dark'
                        ? 'bg-dark-header border-light-header'
                        : 'bg-light-header border-dark-header'


                    )}
                  >
                    <div className='py-1'>
                      {/* 알림 */}
                      <Link
                        to='/notifications'
                        className={cn(
                          'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg',
                          textColor
                        )}
                      >
                        <span>알림 확인</span>
                        {hasUnreadNotifications && (
                          // db랑 연결되면 알림 갯수는 db에서 가져오기로
                          <span className='ml-2 text-red-600 font-bold'>
                            100
                          </span>
                        )}
                      </Link>
                      {/* 마이 페이지로 */}
                      <Link
                        to='/my-page'
                        className={cn(
                          'flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 hover:text-dark-bg',
                          textColor
                        )}
                      >
                        마이페이지
                      </Link>
                      <hr className='my-1' />
                      {/* api 나오면 로그아웃도 함수로 연결하기 */}
                      <button
                        onClick={handleLogin}
                        className='block w-full text-left px-4 py-2 text-sm text-warning font-bold hover:bg-gray-100 hover:font-bold'
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 로그아웃 상태일 때
              <div className='flex items-center space-x-2'>
                <Link to='/login' className='px-4 py-2 text-sm hover:font-bold'>
                  로그인/회원가입
                </Link>
              </div>
            )}
            <Button variant='primary' onClick={handleWritePost}>
              게시글 작성
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;