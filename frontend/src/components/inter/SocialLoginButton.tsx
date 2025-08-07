import React from 'react';

interface SocialLoginButtonProps {
  provider: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  icon: React.ReactNode;
  hovered: boolean;
  onHover: (isHover: boolean) => void;
  onClick: () => void;
  disabled?: boolean;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  label,
  bgColor,
  textColor,
  borderColor,
  icon,
  hovered,
  onHover,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`w-full h-12 font-medium rounded-lg flex items-center justify-center relative transition-all duration-200 whitespace-nowrap ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${
        hovered && !disabled ? 'opacity-90 transform scale-[0.98]' : ''
      }`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: borderColor ? `1px solid ${borderColor}` : 'none',
      }}
      onMouseEnter={() => !disabled && onHover(true)}
      onMouseLeave={() => !disabled && onHover(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center">
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
      </div>
    </button>
  );
};

export default SocialLoginButton;
