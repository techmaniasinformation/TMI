import React from 'react';
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/utils"
import { Link } from 'react-router-dom';

const footerVariants = cva(
"text-white", // 기본 글자 색상
  {
    variants: {
      variant: {
        light: "bg-light-header text-dark-bg",
        dark: "bg-dark-header text-white",
        transparent: "bg-transparent text-dark-bg", // 필요 시 추가
      },
      size: {
        default: "py-8",
        compact: "py-4",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "default",
    },
  }
)


interface FooterProps extends VariantProps<typeof footerVariants> {
}


const Footer: React.FC<FooterProps> = ({ 
  variant = "light",
  size = "default",
}) => {
  return (
    <footer className={cn(footerVariants({ variant, size }))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              <a href="https://forms.gle/s1as8JXfeYZzsSmcA" 
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank" // 새 탭에서 열기
              >
                문의하기
              </a>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
              © 2025 TMI. All rights reserved.
              </p>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer; 
// export { Footer, footerVariants }