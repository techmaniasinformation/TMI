import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import SocialLoginButton from '@/components/inter/SocialLoginButton';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { useThemeStore } from '@/stores/themeStore';

// 다크모드 관련
const loginPageVariants = cva(
   'flex items-center justify-center transition-colors duration-300 py-16', 
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
  const navigate = useNavigate();

  const { isDarkMode } = useThemeStore();
  const variant = isDarkMode ? 'dark' : 'light';

  //소셜 로그인 요청 함수. 추후 hooks에 옮긴 후 import 해올 가능성 높음
  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google') => {
    try {
      //fetch로 백엔드에 요청 (api 파일 제대로 만들어지면 싹 수정하기)
      const response = await fetch(
        `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`,
        {
          method: 'GET',
          credentials: 'include', // 쿠키 기반 인증 시 필요
        }
      );

      if (!response.ok) {
        throw new Error(`${provider} 로그인 요청 실패`);
      }

      const data = await response.json();

      // 성공 여부 확인
      if (data.status === 'SUCCESS') {
        if (data.data.isNew) {
          //신규 회원 → 회원가입 페이지로 이동
          // const { provider, providerMemberId } = data.data;
          navigate(`/signup`);
        } else {
          //기존 회원 → 이전 페이지로 이동
          navigate(-1);
        }
      } else {
        throw new Error('로그인 응답 실패');
      }
    } catch (error) {
      console.error(`${provider} 로그인 중 오류 발생`, error);
      alert(`${provider} 로그인에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  return (
    <div className={cn(loginPageVariants({ variant }))}>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <div className='text-center mb-12'>
          <div className='mb-8'>
            <h1 className='text-7xl font-bold'>TMI</h1>
          </div>
          {/* Section Label with Lines */}
          <div className='flex items-center mb-10'>
            <div className='flex-1 h-px bg-gray-300'></div>
            <span className='px-4 text-sm'>로그인/회원가입</span>
            <div className='flex-1 h-px bg-gray-300'></div>
          </div>
        </div>

        {/* Login Buttons */}
        <div className='space-y-3'>
          {/* 카카오 */}
          <SocialLoginButton
            provider='Kakao'
            label='카카오로 시작하기'
            bgColor='#FEE500'
            textColor='black'
            icon={<i className='fas fa-comment text-lg'></i>}
            hovered={hoveredButton === 'kakao'}
            onHover={(isHover) => setHoveredButton(isHover ? 'kakao' : null)}
            onClick={() => handleSocialLogin('kakao')}
          />

          {/* 네이버 */}
          <SocialLoginButton
            provider='Naver'
            label='네이버로 시작하기'
            bgColor='#03C75A'
            textColor='white'
            icon={<span className='text-lg font-bold'>N</span>}
            hovered={hoveredButton === 'naver'}
            onHover={(isHover) => setHoveredButton(isHover ? 'naver' : null)}
            onClick={() => handleSocialLogin('naver')}
          />

          {/* 구글 */}
          <SocialLoginButton
            provider='Google'
            label='구글로 시작하기'
            bgColor='white'
            textColor='gray'
            borderColor='#ccc'
            icon={
              <i
                className='fab fa-google text-lg'
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
            onClick={() => handleSocialLogin('google')}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
