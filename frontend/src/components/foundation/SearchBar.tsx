import React, { useState } from "react";

interface SearchBarProps {
  addToRecentSearches: (term: string) => void;
  recentSearches: string[];
  removeFromRecentSearches: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  addToRecentSearches,
  recentSearches,
  removeFromRecentSearches,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

      // 검색어 추천용 딕셔너리 // db 정리되면 이것도 db랑 연결 
  const dictionary = [
    "react",
    "javascript",
    "typescript",
    "python",
    "java",
    "node.js",
    "html",
    "css",
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) return;
    setSearchQuery(value);
    setSearchError("");
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() === "") {
      setShowRecentSearches(true);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
      setShowRecentSearches(false);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchError("검색어를 입력해주세요");
      setShowSearchResults(false);
      return;
    }
    addToRecentSearches(searchQuery);
    setShowSearchResults(true);
  };

  const matchedWords = dictionary.filter((word) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          )}
        </div>
        {searchError && <p className="mt-1 text-sm text-red-500">{searchError}</p>}
      </form>

      {(showSearchResults || showRecentSearches) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">최근 검색어</h3>
                <button
                  onClick={() => removeFromRecentSearches("")}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  전체 삭제
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
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
  );
};

export default SearchBar;
