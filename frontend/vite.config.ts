import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    // 청크 크기 최적화
    chunkSizeWarningLimit: 1000,
    // 소스맵 생성 비활성화 (프로덕션에서)
    sourcemap: false,
    // 미니파이 옵션
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log 제거
        drop_debugger: true // debugger 제거
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React 관련 라이브러리들을 하나의 청크로
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // UI 라이브러리들을 하나의 청크로
          if (id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'ui-vendor';
          }
          
          // 유틸리티 라이브러리들을 하나의 청크로
          if (id.includes('node_modules/zustand')) {
            return 'utils-vendor';
          }
          
          // 이미지 에셋들을 별도 청크로 (큰 용량)
          if (id.includes('@/assets/images/')) {
            return 'images';
          }
          
          // 페이지별 코드 분할
          if (id.includes('/pages/')) {
            return 'pages';
          }
          
          // 컴포넌트별 코드 분할
          if (id.includes('/components/')) {
            return 'components';
          }
          
          // 훅별 코드 분할
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})