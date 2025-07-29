import { useState } from 'react';

export const useAuth = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} 로그인 시작`);
    // 실제 소셜 로그인 로직은 여기에 구현
  };

  return {
    hoveredButton,
    setHoveredButton,
    handleSocialLogin
  };
}; 