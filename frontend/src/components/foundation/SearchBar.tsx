import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  variant = 'light', 
  className = '' 
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="검색어를 입력하세요..."
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            variant === 'dark' 
              ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' 
              : 'bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded-r-lg ${
            variant === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors`}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>


    </div>
  );
};

export default SearchBar;
