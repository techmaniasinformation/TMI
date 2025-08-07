// hooks/auth/useSocialLogin.ts
import { useUserStore } from '@/stores/userStore';
import { useAuth } from '@/hooks/auth/useAuth';

const useSocialLogin = () => {
  const { login, isLoading } = useUserStore();
  const { hoveredButton, setHoveredButton } = useAuth();

  // 소셜 로그인 처리
  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google') => {
    console.log(`[SOCIAL_LOGIN] ${provider} 로그인 버튼 클릭됨`);
    try {
      console.log(`[SOCIAL_LOGIN] userStore.login(${provider}) 호출`);
      await login(provider);
      console.log(`[SOCIAL_LOGIN] ${provider} 로그인 처리 완료`);
    } catch (error) {
      console.error(`[SOCIAL_LOGIN] ${provider} 로그인 오류:`, error);
    }
  };

  // 호버 상태 관리
  const handleHover = (isHover: boolean, provider: 'kakao' | 'naver' | 'google') => {
    console.log(`[SOCIAL_LOGIN] ${provider} 호버 상태: ${isHover}`);
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