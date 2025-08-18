import React from 'react';
const SocialLoginButton = ({
  provider,
  label,
  bgColor,
  textColor,
  borderColor,
  icon,
  hovered,
  onHover,
  onClick,
  disabled = false
}) => {
  return /*#__PURE__*/React.createElement("button", {
    className: `w-full h-12 font-medium rounded-lg flex items-center justify-center relative transition-all duration-200 whitespace-nowrap ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${hovered && !disabled ? 'opacity-90 transform scale-[0.98]' : ''}`,
    style: {
      backgroundColor: bgColor,
      color: textColor,
      border: borderColor ? `1px solid ${borderColor}` : 'none'
    },
    onMouseEnter: () => !disabled && onHover(true),
    onMouseLeave: () => !disabled && onHover(false),
    onClick: disabled ? undefined : onClick,
    disabled: disabled
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2"
  }, icon), /*#__PURE__*/React.createElement("span", null, label)));
};
export default SocialLoginButton;