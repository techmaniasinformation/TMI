// hooks/auth/useSocialLogin.ts
import { useUserStore } from '@/stores/userStore';
import { useAuth } from '@/hooks/auth/useAuth';

const useSocialLogin = () => {
  const { login, isLoading } = useUserStore();
  const { hoveredButton, setHoveredButton } = useAuth();

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google') => {
    try {
      await login(provider);
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
    }
  };

  // 호버 상태 관리
  const handleHover = (isHover: boolean, provider: 'kakao' | 'naver' | 'google') => {
    setHoveredButton(isHover ? provider : null);
  };

  return {
    handleSocialLogin,
    handleHover,
    hoveredButton,
    isLoading,
  };
};

export default useSocialLogin;