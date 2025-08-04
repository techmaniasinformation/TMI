import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import SocialLoginButton from '@/components/inter/SocialLoginButton';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { useThemeStore } from '@/stores/themeStore';

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
  const navigate = useNavigate();

  const { isDarkMode } = useThemeStore();
  const variant = isDarkMode ? 'dark' : 'light';

  // 로케이션에서 여는 방식
  // const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
  //   window.location.href = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
  // };

  //팝업으로 여는 방식
  // const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
  //   const width = 500;
  //   const height = 600;
  //   const left = window.screenX + (window.outerWidth - width) / 2;
  //   const top = window.screenY + (window.outerHeight - height) / 2;

  //   const popup = window.open(
  //     `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`,
  //     `${provider}-login`,
  //     `width=${width},height=${height},left=${left},top=${top}`
  //   );

  //   if (!popup) {
  //     alert('팝업 차단을 해제해주세요.');
  //     return;
  //   }

  //   // &&& 메인창에서 응답 수신
  //   const handleMessage = (event: MessageEvent) => {
  //     if (event.origin !== 'https://i13a509.p.ssafy.io') return; // 보안 체크

  //     try {
  //       const data = JSON.parse(event.data); // &&& 서버에서 JSON 형태로 postMessage 보낸다고 가정

  //       if (data.status === 'SUCCESS') {
  //         if (data.data.isNew) {
  //           navigate('/signup'); // 신규 회원
  //         } else {
  //           navigate(-1); // 기존 회원
  //         }
  //       } else {
  //         console.error('❌ 로그인 실패:', data.message);
  //         alert('로그인에 실패했습니다.');
  //       }
  //     } catch (err) {
  //       console.error('❌ 메시지 파싱 실패:', err);
  //     }

  //     // &&& 메시지 받으면 팝업 닫기
  //     popup.close();

  //     window.removeEventListener('message', handleMessage);
  //   };

  //   window.addEventListener('message', handleMessage);
  // };


  //팝업창. 임시로 팝업창 닫히면 무조건 signup으로 이동하도록 함. 0805에 be에 수정사항 반영 부탁하기. ㅇ
const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
  console.log(`🚀 소셜 로그인 시작: ${provider}`);

  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  // 팝업 열기
  const popup = window.open(
    `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`,
    `${provider}-login`,
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    console.error('❌ 팝업 차단됨');
    alert('팝업 차단을 해제해주세요.');
    return;
  }

  console.log('✅ 팝업창이 열렸습니다.');

  // 팝업 닫힘 감지
  const checkPopupClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkPopupClosed);
      console.log('🔒 팝업창이 닫혔습니다.');

      // 여기서 라우팅 (임시로 신규회원이라고 가정)
      console.log('➡ 신규 회원으로 가정하고 /signup 으로 이동합니다.');
      navigate('/signup');

      // 기존 회원으로 테스트하려면 아래 코드 사용
      // console.log('➡ 기존 회원으로 가정하고 이전 페이지로 이동합니다.');
      // navigate(-1);
    }
  }, 500);
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
