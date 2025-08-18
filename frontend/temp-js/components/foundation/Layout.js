import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useThemeStore } from '@/stores/themeStore'; // 테마 전역변수
import useSocialLogin from '@/hooks/auth/useSocialLogin'; // 소셜 로그인 훅

const Layout = () => {
  const location = useLocation();
  // 랜딩 페이지에서 여백 없애기
  const isNoPadding = location.pathname === '/';

  // 테마 전역변수
  const {
    isDarkMode
  } = useThemeStore();

  // 소셜 로그인 훅 사용 (전역적으로 실행)
  useSocialLogin();
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement(Header, {
    variant: isDarkMode ? 'dark' : 'light'
  }), /*#__PURE__*/React.createElement("main", {
    className: `flex-1 transition-colors duration-300 
    ${isDarkMode ? 'bg-dark-bg text-white' : 'bg-gray-50 text-gray-900'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: isNoPadding ? 'w-full h-full' // 랜딩페이지에서 여백 없앰
    : 'max-w-7xl mx-auto px-4 py-8' // 기본 여백
  }, /*#__PURE__*/React.createElement(Outlet, null))), /*#__PURE__*/React.createElement(Footer, {
    variant: isDarkMode ? 'dark' : 'light'
  }));
};
export default Layout;