import React, { useState, useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { useThemeStore } from '@/stores/themeStore';
import TagArea from '@/components/domain/article/TagArea';
import { useTagAutocomplete } from '@/hooks/tags';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { createSearchParams } from '@/utils/searchUtils';

// SearchBar 스타일 정의
const searchBarVariants = cva('w-full pl-10 pr-20 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', {
  variants: {
    variant: {
      light: 'bg-light-bg border border-dark-bg text-dark-bg placeholder-gray-500',
      dark: 'bg-dark-bg border border-light-bg text-light-bg placeholder-gray-400'
    }
  },
  defaultVariants: {
    variant: 'light'
  }
});

//드롭다운 스타일 정의
const dropdownVariants = cva('absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50', {
  variants: {
    variant: {
      light: 'bg-light-bg border border-dark-bg text-light-bg',
      dark: 'bg-dark-bg border border-light-bg text-dark-bg'
    }
  },
  defaultVariants: {
    variant: 'light'
  }
});
const SearchBar = ({
  addToRecentSearches,
  recentSearches,
  removeFromRecentSearches,
  variant
}) => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchError, setSearchError] = useState('');
  const [tagLimitError, setTagLimitError] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const {
    isDarkMode
  } = useThemeStore();
  const activeVariant = variant || (isDarkMode ? 'dark' : 'light');
  const [selectedTags, setSelectedTags] = useState([]);
  const {
    suggestions,
    loading: tagLoading,
    error: tagApiError,
    searchTags,
    clearSuggestions,
    tagSearchResults
  } = useTagAutocomplete({
    minLength: 1,
    debounceMs: 300
  });
  const handleTagRemove = tagName => {
    setSelectedTags(prevTags => prevTags.filter(t => t.name !== tagName));
    setTagLimitError('');
  };
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearchChange = e => {
    const value = e.target.value;
    if (value.length > 20) return;
    setSearchKeyword(value);
    setSearchError('');
    if (value.trim()) {
      setShowSearchResults(true);
      setShowRecentSearches(false);
    } else {
      setShowSearchResults(false);
      setShowRecentSearches(true);
    }
    searchTags(value);
  };
  const handleSearchFocus = () => {
    setShowSearchResults(true);
    setShowRecentSearches(false);
  };
  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
      setShowRecentSearches(false);
    }, 200);
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchKeyword.trim() === '' && selectedTags.length === 0) {
      setSearchError('검색어를 입력하거나 태그를 선택해주세요');
      setShowSearchResults(false);
      return;
    }
    if (searchKeyword.trim()) {
      addToRecentSearches(searchKeyword);
    }
    const techTags = selectedTags.filter(tag => tag.type === 'tech');
    const companyTags = selectedTags.filter(tag => tag.type === 'company');
    const searchParams = createSearchParams(searchKeyword.trim(), techTags.map(tag => Number(tag.id).toString()), companyTags.map(tag => Number(tag.id).toString()), 1);
    const searchUrl = `${ROUTES.SEARCH}?${searchParams.toString()}`;
    navigate(searchUrl);
    setSearchKeyword('');
    setSelectedTags([]);
    setShowSearchResults(false);
    setShowRecentSearches(false);
    clearSuggestions();
  };
  const matchedWords = searchKeyword.trim() === '' ? [] : suggestions;
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: "flex-1 max-w-2xl mx-8 relative"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearchSubmit,
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchKeyword,
    onChange: handleSearchChange,
    onFocus: handleSearchFocus,
    placeholder: "\uAE30\uC220 \uBE14\uB85C\uADF8 \uAC80\uC0C9...",
    className: cn(searchBarVariants({
      variant: activeVariant
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
  }, /*#__PURE__*/React.createElement("i", {
    className: cn('fas fa-search', activeVariant === 'dark' ? 'text-gray-400' : 'text-gray-500')
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 right-0 flex items-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: searchKeyword.trim() === '' && selectedTags.length === 0,
    className: cn('px-4 py-1 mr-1 text-sm font-medium rounded-md transition-colors', searchKeyword.trim() !== '' || selectedTags.length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-400 text-gray-200 cursor-not-allowed')
  }, "\uAC80\uC0C9"), searchKeyword && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSearchKeyword('');
      setSearchError('');
    },
    className: "pr-3 flex items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: cn('fas fa-times text-sm', activeVariant === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600')
  })))), searchError && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-sm text-red-500"
  }, searchError)), showSearchResults && /*#__PURE__*/React.createElement("div", {
    className: cn(dropdownVariants({
      variant: activeVariant
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: cn('text-sm font-medium mb-2', isDarkMode ? 'text-light-header' : 'text-dark-header')
  }, "\uCD94\uCC9C \uAC80\uC0C9\uC5B4"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 min-h-[40px]"
  }, tagLoading ? /*#__PURE__*/React.createElement("div", {
    className: "p-2 text-sm text-gray-500 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
  }), "\uD0DC\uADF8 \uAC80\uC0C9 \uC911...") : tagApiError ? /*#__PURE__*/React.createElement("div", {
    className: "p-2 text-sm text-red-500"
  }, tagApiError) : matchedWords.length > 0 ? matchedWords.slice(0, 5).map(tag => /*#__PURE__*/React.createElement("div", {
    key: `${tag.type}-${tag.id}`,
    className: cn('p-2 hover:bg-gray-50 rounded cursor-pointer group flex items-center gap-2', isDarkMode ? 'text-light-header hover:bg-gray-700' : 'text-dark-header hover:bg-gray-100'),
    onClick: () => {
      if (selectedTags.length >= 5) {
        setTagLimitError('검색 태그는 최대 5개 선택 가능합니다');
        return;
      }
      setSearchKeyword('');
      addToRecentSearches(tag.name);
      if (!selectedTags.some(selectedTag => selectedTag.id === tag.id && selectedTag.type === tag.type)) {
        setSelectedTags([...selectedTags, tag]);
      }
      clearSuggestions();
      const inputElement = document.querySelector('input[type="text"]');
      inputElement?.focus();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: cn('text-xs px-1.5 py-0.5 rounded text-white font-medium', tag.type === 'tech' ? 'bg-blue-500' : 'bg-purple-500')
  }, tag.type === 'tech' ? 'T' : 'C'), /*#__PURE__*/React.createElement("span", {
    className: cn('text-sm flex-1', isDarkMode ? 'text-light-header group-hover:text-white' : 'text-dark-header group-hover:text-black')
  }, tag.name), /*#__PURE__*/React.createElement("span", {
    className: cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')
  }, tag.type === 'tech' ? '기술' : '회사'))) : searchKeyword.trim() !== '' && !tagLoading ? /*#__PURE__*/React.createElement("div", {
    className: "p-2 text-sm text-gray-400"
  }, "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4") : searchKeyword.trim() === '' ? /*#__PURE__*/React.createElement("div", {
    className: "p-2 text-sm text-gray-400"
  }, "\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694") : /*#__PURE__*/React.createElement("div", {
    className: "p-2 text-sm text-gray-400"
  }, " ")), selectedTags.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "my-3 border-gray-300 dark:border-gray-600"
  }), /*#__PURE__*/React.createElement("h3", {
    className: cn('text-sm font-medium mb-2', isDarkMode ? 'text-light-header' : 'text-dark-header')
  }, "\uC120\uD0DD\uB41C \uD0DC\uADF8"), /*#__PURE__*/React.createElement(TagArea, {
    tags: selectedTags.map(tag => tag.name),
    maxTags: 5,
    onRemoveTag: handleTagRemove
  }), tagLimitError && /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-sm text-red-500"
  }, tagLimitError)))));
};
export default SearchBar;