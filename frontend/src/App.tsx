import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;

// 다크모드 기능 추가 버전 (S13P11A509-100-프론트-레이아웃-및-네비게이션 브랜치 기준)
/*
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { useThemeStore } from './stores/themeStore';

const App: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // 다크모드 상태에 따라 HTML에 dark 클래스 추가/제거
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <RouterProvider router={router} />;
};

export default App;
*/
