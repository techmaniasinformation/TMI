import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import { useEffect } from 'react';

const App = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
