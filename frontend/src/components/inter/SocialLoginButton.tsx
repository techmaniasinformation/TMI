// components/auth/SocialLoginButton.tsx
import React from 'react';

interface SocialLoginButtonProps {
  provider: 'Kakao' | 'Naver' | 'Google';
  label: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
  hovered: boolean;
  onHover: (isHover: boolean) => void;
  onClick: () => void;
  borderColor?: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  label,
  bgColor,
  textColor,
  icon,
  hovered,
  onHover,
  onClick,
  borderColor,
}) => {
  return (
    <button
      className={`w-full h-12 font-medium rounded-lg flex items-center justify-center relative transition-all duration-200 whitespace-nowrap cursor-pointer
        ${hovered ? 'opacity-90 transform scale-[0.98]' : ''}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default SocialLoginButton;
