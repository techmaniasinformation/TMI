import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useThemeStore } from '@/stores/themeStore';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import SocialLoginButton from '@/components/inter/SocialLoginButton';
import useSocialLogin from '@/hooks/auth/useSocialLogin'; // 새 훅 임포트
import { useLocation } from 'react-router-dom'; // 이전 페이지 저장용
import { useUserStore } from '@/stores/userStore';

// 다크모드 관련
const loginPageVariants = cva(
  'flex items-center justify-center transition-colors duration-300 py-8',
  {
    variants: { 
      variant: {
        light: 'bg-light-bg text-dark-bg ',
        dark: 'bg-dark-bg text-white ',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
);

interface LoginPageProps extends VariantProps<typeof loginPageVariants> {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const { hoveredButton, setHoveredButton } = useAuth();
  const { isDarkMode } = useThemeStore();
  const variant = isDarkMode ? 'dark' : 'light';

  // 로그인 완료 후 경로 용도
  const location = useLocation();
  const from = location.state?.from || '/'; // 이전 페이지 or 홈 경로 기본값

  // useSocialLogin 훅 사용 (Layout에서 전역적으로 처리됨)
  const { handleSocialLoginWithLocation } = useSocialLogin();

  return (
    <div className={cn(loginPageVariants({ variant }))}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-7xl font-bold">TMI</h1>
          </div>
          {/* Section Label with Lines */}
          <div className="flex items-center mb-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm">로그인/회원가입</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Login Buttons */}
        <div className="space-y-3">
          {/* 카카오 */}
          <SocialLoginButton
            provider="Kakao"
            label="카카오로 시작하기"
            bgColor="#FEE500"
            textColor="black"
            icon={<i className="fas fa-comment text-lg"></i>}
            hovered={hoveredButton === 'kakao'}
            onHover={(isHover) => setHoveredButton(isHover ? 'kakao' : null)}
            onClick={() => handleSocialLoginWithLocation('kakao', from)} // 로케이션 방식
          />

          {/* 네이버 */}
          <SocialLoginButton
            provider="Naver"
            label="네이버로 시작하기"
            bgColor="#03C75A"
            textColor="white"
            icon={<span className="text-lg font-bold">N</span>}
            hovered={hoveredButton === 'naver'}
            onHover={(isHover) => setHoveredButton(isHover ? 'naver' : null)}
            onClick={() => handleSocialLoginWithLocation('naver', from)} // 로케이션 방식
            // onClick={() => {window.location.href =https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=L000gCRdLnKJ0o11XI5j&&redirect_uri=http://localhost:3000/login}}
          />

          {/* 구글 */}
          <SocialLoginButton
            provider="Google"
            label="구글로 시작하기"
            bgColor="white"
            textColor="gray"
            borderColor="#ccc"
            icon={
              <i
                className="fab fa-google text-lg"
                style={{
                  background:
                    'conic-gradient(from -45deg, #ea4335 110deg, #4285f4 110deg 200deg, #34a853 200deg 290deg, #fbbc05 290deg)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              ></i>
            }
            hovered={hoveredButton === 'google'}
            onHover={(isHover) => setHoveredButton(isHover ? 'google' : null)}
            onClick={() => handleSocialLoginWithLocation('google', from)} // 로케이션 방식
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;