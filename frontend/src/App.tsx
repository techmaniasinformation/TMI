import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import './App.css';

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
