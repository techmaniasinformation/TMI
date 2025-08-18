import React from 'react';
import { cva } from "class-variance-authority";
import { cn } from "@/utils/utils";
const footerVariants = cva("text-white",
// 기본 글자 색상
{
  variants: {
    variant: {
      light: "bg-light-header text-dark-bg",
      dark: "bg-dark-header text-white",
      transparent: "bg-transparent text-dark-bg" // 필요 시 추가
    },
    size: {
      default: "py-8",
      compact: "py-4"
    }
  },
  defaultVariants: {
    variant: "light",
    size: "default"
  }
});
const Footer = ({
  variant = "light",
  size = "default"
}) => {
  return /*#__PURE__*/React.createElement("footer", {
    className: cn(footerVariants({
      variant,
      size
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between items-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 text-sm"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://forms.gle/s1as8JXfeYZzsSmcA",
    className: "text-gray-400 hover:text-white transition-colors",
    target: "_blank" // 새 탭에서 열기
  }, "\uBB38\uC758\uD558\uAE30")), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-6 mt-4 md:mt-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-400 text-sm"
  }, "\xA9 2025 TMI. All rights reserved.")))));
};
export default Footer;
// export { Footer, footerVariants }