import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import { useAlertStore } from './stores/alertStore';
import { useEffect } from 'react';
import { CustomAlert } from './components/foundation';

const App = () => {
  const { isDarkMode } = useThemeStore();
  const { alertState, hideAlert } = useAlertStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-light-bg dark:bg-dark-bg">
        <RouterProvider router={router} />
        <CustomAlert
          message={alertState.message}
          type={alertState.type}
          duration={alertState.duration}
          isVisible={alertState.isVisible}
          onClose={hideAlert}
        />
      </div>
    </div>
  );
};

export default App;
