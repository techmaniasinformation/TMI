// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JS, JSX, TS, TSX 파일
    "./public/index.html", // public/index.html도 포함
  ],
  theme: {
    extend: {
      colors: {
        //주요 버튼 색상
        'prime-btn' : '#5B6FFF',
        // 라이트 모드 배경 색상
        'light-bg' : '#f8f9ff',
        // 라이트 모드 헤더 색상
        'light-header': '#fff',
        //다크 모드 배경 색상
        'dark-bg' : '#0A1929',
        //다크 모드 헤더 색상
        'dark-header': '#0A1F33',
      },
    },
  },
  plugins: [],
};