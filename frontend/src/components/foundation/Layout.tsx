import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useThemeStore } from "@/stores/themeStore"; // 테마 전역변수

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  // 랜딩 페이지에서 여백 없애기
  const isNoPadding = location.pathname === '/';

  // 테마 전역변수 
  const { isDarkMode } = useThemeStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <Header variant={isDarkMode ? "dark" : "light"}/>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-50 dark:bg-dark-bg">
        <div
          className={
            isNoPadding
              ? 'w-full h-full' // 랜딩페이지에서 여백 없앰
              : 'max-w-7xl mx-auto px-4 py-8' // 기본 여백
          }
        >
          <Outlet />
        </div>
      </main>
      
      {/* 푸터 */}
      {/* 라이트/다크 결정 변수 만들면 그거에 따라 variant값 변경하도록.  */}
      <Footer variant={isDarkMode ? "dark" : "light"}/>
    </div>
  );
};

export default Layout; 