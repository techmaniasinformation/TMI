// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JS, JSX, TS, TSX 파일
    "./public/index.html", // public/index.html도 포함
  ],
  darkMode: 'class', // 다크모드 활성화
  theme: {
    extend: {
      colors: {
        //주요 버튼 색상
        'prime-btn' : '#5B6FFF',
        'prime-btn-hover': '#4C5DE6',
        // 라이트 모드 배경 색상
        'light-bg' : '#f8f9ff',
        'light-bg-hover': '#e0e7ff',
        // 라이트 모드 헤더 색상
        'light-header': '#fff',
        //다크 모드 배경 색상
        'dark-bg' : '#0A1929',
        'dark-bg-hover': '#132f4d', 
        //다크 모드 헤더 색상
        'dark-header': '#0A1F33',
        // 두 모드에서 잘 보일 빨간색
        'warning':'#ff5c5c',
      },
      //별똥별 움직임 관련
      keyframes: {
        'shooting-star-1': {
          '0%': { opacity: '0', transform: 'translateX(-100px) translateY(50px)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(calc(100vw + 100px)) translateY(-50px)' },
        },
        'shooting-star-2': {
          '0%': { opacity: '0', transform: 'translateX(100px) translateY(-50px)' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(calc(-100vw - 100px)) translateY(50px)' },
        },
        'shooting-star-3': {
          '0%': { opacity: '0', transform: 'translateX(-80px) translateY(30px)' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(calc(100vw + 80px)) translateY(-30px)' },
        },
      },
      animation: {
        'shooting-star-1': 'shooting-star-1 4s infinite 2s',
        'shooting-star-2': 'shooting-star-2 5s infinite 4s',
        'shooting-star-3': 'shooting-star-3 3s infinite 6s',
      },
    },
  },
  plugins: [],
};