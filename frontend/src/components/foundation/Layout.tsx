import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  // 랜딩 페이지에서 여백 없애기
  const isNoPadding = location.pathname === '/';
  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-50">
        <div
          className={
            isNoPadding
              ? 'w-full h-full' // 여백 없앰
              : 'max-w-7xl mx-auto px-4 py-8' // 기본 여백
          }
        >
          <Outlet />
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default Layout; 