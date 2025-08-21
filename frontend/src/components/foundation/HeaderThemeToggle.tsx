import React from 'react';

interface HeaderThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const HeaderThemeToggle: React.FC<HeaderThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className='p-2 text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center'
    >
      <i
        className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}
      />
    </button>
  );
};

export default HeaderThemeToggle;


