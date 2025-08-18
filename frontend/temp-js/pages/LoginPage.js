import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useThemeStore } from '@/stores/themeStore';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import SocialLoginButton from '@/components/inter/SocialLoginButton';
import useSocialLogin from '@/hooks/auth/useSocialLogin'; // 새 훅 임포트
import { useLocation } from 'react-router-dom'; // 이전 페이지 저장용

// 다크모드 관련
const loginPageVariants = cva('flex items-center justify-center transition-colors duration-300 py-8', {
  variants: {
    variant: {
      light: 'bg-light-bg text-dark-bg ',
      dark: 'bg-dark-bg text-white '
    }
  },
  defaultVariants: {
    variant: 'light'
  }
});
const LoginPage = () => {
  const {
    hoveredButton,
    setHoveredButton
  } = useAuth();
  const {
    isDarkMode
  } = useThemeStore();
  const variant = isDarkMode ? 'dark' : 'light';

  // 로그인 완료 후 경로 용도
  const location = useLocation();
  const from = location.state?.from || '/'; // 이전 페이지 or 홈 경로 기본값

  // useSocialLogin 훅 사용 (Layout에서 전역적으로 처리됨)
  const {
    handleSocialLoginWithLocation
  } = useSocialLogin();
  return /*#__PURE__*/React.createElement("div", {
    className: cn(loginPageVariants({
      variant
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-7xl font-bold"
  }, "TMI")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-gray-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "px-4 text-sm"
  }, "\uB85C\uADF8\uC778/\uD68C\uC6D0\uAC00\uC785"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-gray-300"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(SocialLoginButton, {
    provider: "Kakao",
    label: "\uCE74\uCE74\uC624\uB85C \uC2DC\uC791\uD558\uAE30",
    bgColor: "#FEE500",
    textColor: "black",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-comment text-lg"
    }),
    hovered: hoveredButton === 'kakao',
    onHover: isHover => setHoveredButton(isHover ? 'kakao' : null),
    onClick: () => handleSocialLoginWithLocation('kakao', from) // 로케이션 방식
  }), /*#__PURE__*/React.createElement(SocialLoginButton, {
    provider: "Google",
    label: "\uAD6C\uAE00\uB85C \uC2DC\uC791\uD558\uAE30",
    bgColor: "white",
    textColor: "gray",
    borderColor: "#ccc",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fab fa-google text-lg",
      style: {
        background: 'conic-gradient(from -45deg, #ea4335 110deg, #4285f4 110deg 200deg, #34a853 200deg 290deg, #fbbc05 290deg)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }),
    hovered: hoveredButton === 'google',
    onHover: isHover => setHoveredButton(isHover ? 'google' : null),
    onClick: () => handleSocialLoginWithLocation('google', from) // 로케이션 방식
  }))));
};
export default LoginPage;