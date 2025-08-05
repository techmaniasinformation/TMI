// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const { hoveredButton, setHoveredButton, handleSocialLogin } = useAuth();

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-7xl font-bold text-gray-800">TMI</h1>
          </div>
          {/* Section Label with Lines */}
          <div className="flex items-center mb-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">로그인/회원가입</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Login Buttons */}
        <div className="space-y-3">
          {/* Kakao Login */}
          <button
            className={`w-full h-12 bg-yellow-400 text-black font-medium rounded-lg flex items-center justify-center relative transition-all duration-200 whitespace-nowrap cursor-pointer ${
              hoveredButton === 'kakao' ? 'opacity-90 transform scale-[0.98]' : ''
            }`}
            style={{ backgroundColor: '#FEE500' }}
            onMouseEnter={() => setHoveredButton('kakao')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => handleSocialLogin('Kakao')}
          >
            <i className="fas fa-comment text-lg mr-2"></i>
            <span>카카오로 시작하기</span>
          </button>

          {/* Naver Login */}
          <button
            className={`w-full h-12 bg-green-500 text-white font-medium rounded-lg flex items-center justify-center relative transition-all duration-200 whitespace-nowrap cursor-pointer ${
              hoveredButton === 'naver' ? 'opacity-90 transform scale-[0.98]' : ''
            }`}
            style={{ backgroundColor: '#03C75A' }}
            onMouseEnter={() => setHoveredButton('naver')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => handleSocialLogin('Naver')}
          >
            <span className="text-lg font-bold mr-2">N</span>
            <span>네이버로 시작하기</span>
          </button>

          {/* Google Login */}
          <button
            className={`w-full h-12 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 flex items-center justify-center relative transition-all duration-200 whitespace-nowrap cursor-pointer ${
              hoveredButton === 'google' ? 'opacity-90 transform scale-[0.98]' : ''
            }`}
            onMouseEnter={() => setHoveredButton('google')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => handleSocialLogin('Google')}
          >
            <div className="flex items-center justify-center">
              <i className="fab fa-google text-lg mr-2" style={{
                background: 'conic-gradient(from -45deg, #ea4335 110deg, #4285f4 110deg 200deg, #34a853 200deg 290deg, #fbbc05 290deg)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}></i>
              <span>구글로 시작하기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 