// hooks/auth/useSocialLogin.ts
import { useNavigate } from 'react-router-dom';

const useSocialLogin = () => {
  const navigate = useNavigate();

  // 로케이션 방식으로 소셜 로그인 처리
  const handleSocialLoginWithLocation = (provider: 'kakao' | 'naver' | 'google') => {
    window.location.href = `https://i13a509.p.ssafy.io/api/v1/oauth2/authorization/${provider}`;
  };

  return {
    handleSocialLoginWithLocation,
  };
};

export default useSocialLogin;
