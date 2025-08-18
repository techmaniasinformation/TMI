import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import { useEffect } from 'react';
const App = () => {
  const {
    isDarkMode
  } = useThemeStore();
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  return /*#__PURE__*/React.createElement("div", {
    className: isDarkMode ? 'dark' : ''
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-light-bg dark:bg-dark-bg"
  }, /*#__PURE__*/React.createElement(RouterProvider, {
    router: router
  })));
};
export default App;