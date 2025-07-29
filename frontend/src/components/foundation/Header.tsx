import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./Searchbar"; // ✅ 대소문자 주의
import { Button } from "./button";
import { useThemeStore } from "@/stores/themeStore"; // 테마 불러오기

const headerVariants = cva("text-white", {
  variants: {
    variant: {
      light: "bg-light-header text-dark-bg",
      dark: "bg-dark-header text-white",
      transparent: "bg-transparent text-dark-bg",
    },
    size: {
      default: "py-1",
      compact: "py-1",
    },
  },
  defaultVariants: {
    variant: "light",
    size: "default",
  },
});

interface HeaderProps extends VariantProps<typeof headerVariants> {}

const Header: React.FC<HeaderProps> = ({ variant = "light", size = "default" }) => {
  
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
    setRecentSearches((prev) => [term, ...prev.filter((item) => item !== term)].slice(0, 5));
  };

  const removeFromRecentSearches = (term: string) => {
    if (term === "") {
      setRecentSearches([]);
    } else {
      setRecentSearches((prev) => prev.filter((item) => item !== term));
    }
  };

  // ✅ 게시글 작성 버튼 클릭시 로그인 여부에 따라 반응
  const handleWritePost = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다."); // 알림 표시
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      navigate("/posts/editor"); // 게시글 작성 페이지로 이동 (예: /write)
    }
  };

  return (
    <header className={cn(headerVariants({ variant, size }))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold">TechBlog</span>
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
          {/* 라이트/다크 토글 */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
          >
            <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg`} />
          </button>
            {isLoggedIn ? (
            <div className="relative flex">
              {/* 알림 */}
              <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-gray-700">
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              {/* 프로필 */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20developer&width=32&height=32&orientation=squarish"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">김개발</span>
                <i className="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <Link to="/my-page" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        마이페이지
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        설정
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogin}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm hover:font-bold">
                  로그인/회원가입
                </Link>
                {/* <Button
                  variant="primary"
                  onClick={handleWritePost}
                >
                  게시글 작성
                </Button> */}
              </div>
            )}
                            <Button
                  variant="primary"
                  onClick={handleWritePost}
                >
                  게시글 작성
                </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
