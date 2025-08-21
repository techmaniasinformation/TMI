import React from 'react';
import { cva, type VariantProps } from "class-variance-authority"

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
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
            <p className="text-gray-300 mb-2">SSAFY 13기 A509팀</p>
            <p className="text-gray-300 mb-2">개발자 커뮤니티 플랫폼</p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ssafy.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  SSAFY 공식 사이트
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <p className="text-gray-300 mb-2">이메일: contact@example.com</p>
            <p className="text-gray-300">전화: 02-1234-5678</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 SSAFY A509팀. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
// export { Footer, footerVariants }