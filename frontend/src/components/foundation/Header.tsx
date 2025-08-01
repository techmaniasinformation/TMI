import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {}

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // Mock dictionary for demonstration
  const dictionary = ['react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'html', 'css'];

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) {
      return;
    }
    setSearchQuery(value);
    setSearchError('');
    setShowSearchResults(true);
    if (value.trim() !== '') {
      setSearchError('');
    }
  };

  const handleSearchFocus = () => {
    if (selectedTags.length > 0) {
      setShowSearchResults(true);
      setShowRecentSearches(false);
    } else if (searchQuery.trim() === '') {
      setShowRecentSearches(true);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
      setShowRecentSearches(false);
    }
  };

  const handleSearchBlur = () => {
    if (selectedTags.length === 0) {
      setTimeout(() => {
        setShowSearchResults(false);
        setShowRecentSearches(false);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    setShowSearchResults(false);
    setShowRecentSearches(false);
  };

  const addToRecentSearches = (term: string) => {
    setRecentSearches(prev => {
      const newSearches = [term, ...prev.filter(item => item !== term)].slice(0, 5);
      return newSearches;
    });
  };

  const removeFromRecentSearches = (term: string) => {
    setRecentSearches(prev => prev.filter(item => item !== term));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setSearchError('검색어를 입력해주세요');
      setShowSearchResults(false);
      return;
    }
    setShowSearchResults(true);
  };

  const matchedWords = dictionary.filter(word =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TechBlog</span>
            </Link>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="기술 블로그 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
                  </button>
                )}
              </div>
              {searchError && (
                <p className="mt-1 text-sm text-red-500">{searchError}</p>
              )}
            </form>

            {/* 검색 결과 드롭다운 */}
            {(showSearchResults || showRecentSearches) && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                onMouseLeave={handleMouseLeave}
              >
                {showRecentSearches && recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">최근 검색어</h3>
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        전체 삭제
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((term, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{term}</span>
                          <button
                            onClick={() => removeFromRecentSearches(term)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {showSearchResults && matchedWords.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">추천 검색어</h3>
                    <div className="space-y-1">
                      {matchedWords.map((word, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => {
                            setSearchQuery(word);
                            addToRecentSearches(word);
                            setShowSearchResults(false);
                          }}
                        >
                          <span className="text-sm text-gray-700">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 테마 토글 */}
            <button
              onClick={handleThemeToggle}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {/* 알림 */}
            <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <i className="fas fa-bell"></i>
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>

            {/* 프로필 */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20male%20developer%20with%20modern%20background%2C%20confident%20expression%2C%20tech%20professional&width=32&height=32&seq=user1&orientation=squarish"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">김개발</span>
                  <i className="fas fa-chevron-down text-xs text-gray-500"></i>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        설정
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogin}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/home"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  둘러보기
                </Link>
                <Link
                  to="/home"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  시작하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 