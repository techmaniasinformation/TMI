import { useState, useEffect, useCallback } from 'react';
import { usePopularPosts } from '@/hooks/posts/usePopularPosts';
import { Button } from '@/components/foundation/button';
import { PopularPostItem } from '@/components/domain/article/PopularPostItem';
import { useNavigate } from 'react-router-dom';
import { PopularPostSkeleton } from '@/components/foundation/Skeleton';
import { useThemeStore } from '@/stores/themeStore'; // Import useThemeStore

export default function PopularPosts() {
  const navigate = useNavigate();
  const {
    isDarkMode
  } = useThemeStore(); // Get isDarkMode state

  const {
    posts: popularPosts,
    loading,
    error,
    formatNumber
  } = usePopularPosts(10);

  // 게시글 클릭 핸들러를 useCallback으로 메모이제이션
  const handlePostClick = useCallback(postId => {
    navigate(`/post/${postId}`);
  }, [navigate]);

  // 이미지 로딩 상태 관리
  const [loadedPosts, setLoadedPosts] = useState(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 이미지 로드 완료 시 호출되는 함수를 useCallback으로 메모이제이션
  const handleImageLoad = useCallback(postId => {
    setLoadedPosts(prev => new Set([...Array.from(prev), postId]));
  }, []);

  // 로딩 상태나 게시글이 변경될 때 로딩 상태 초기화
  useEffect(() => {
    setLoadedPosts(new Set());
    setIsInitialLoad(true);
  }, [loading, popularPosts]);

  // 초기 로드 완료 후 이미지 프리로딩 시작
  useEffect(() => {
    if (!loading && popularPosts.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, popularPosts, isInitialLoad]);
  return /*#__PURE__*/React.createElement("div", {
    className: `rounded-lg shadow p-6 ${isDarkMode ? 'bg-dark-bg border border-white' : 'bg-light-bg'}`
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-4 text-gray-900 dark:text-white"
  }, " \uD83D\uDCCA \uC778\uAE30 \uAC8C\uC2DC\uAE00"), !isInitialLoad && /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }, popularPosts.map(post => /*#__PURE__*/React.createElement("img", {
    key: post.postId,
    src: post.thumbnailUrl || '',
    alt: "",
    onLoad: () => handleImageLoad(post.postId),
    onError: () => handleImageLoad(post.postId) // 에러 시에도 로드 완료로 처리
  }))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, [1, 2, 3, 4, 5].map(index => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "animate-pulse",
    style: {
      animationDelay: `${(index - 1) * 0.1}s`,
      animationDuration: '1.5s'
    }
  }, /*#__PURE__*/React.createElement(PopularPostSkeleton, null)))) : error ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle text-4xl text-red-300 dark:text-red-400 mb-4"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "text-lg font-semibold text-red-600 dark:text-red-500 mb-2"
  }, "\uC778\uAE30 \uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 dark:text-gray-300 mb-4"
  }, error)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.location.reload(),
    className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-redo mr-2"
  }), "\uB2E4\uC2DC \uC2DC\uB3C4"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.history.back(),
    className: "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left mr-2"
  }), "\uC774\uC804 \uD398\uC774\uC9C0\uB85C"))) : popularPosts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line text-4xl text-gray-300 dark:text-gray-600 mb-4"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2"
  }, "\uC778\uAE30 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400"
  }, "\uC544\uC9C1 \uC778\uAE30 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uBC88\uC9F8 \uAC8C\uC2DC\uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('/post/create'),
    className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus mr-2"
  }), "\uAC8C\uC2DC\uAE00 \uC791\uC131")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, popularPosts.map((post, index) => {
    const isLoaded = loadedPosts.has(post.postId);
    const hasThumbnail = post.thumbnailUrl;

    // 썸네일이 없거나 이미 로드된 경우 바로 표시
    const shouldShow = !hasThumbnail || isLoaded;
    return shouldShow ? /*#__PURE__*/React.createElement("div", {
      key: post.postId,
      className: "animate-fade-in",
      style: {
        animationDelay: `${index * 0.1}s`,
        animationDuration: '0.5s'
      }
    }, /*#__PURE__*/React.createElement(PopularPostItem, {
      post: post,
      index: index,
      formatNumber: formatNumber,
      onClick: handlePostClick
    })) : /*#__PURE__*/React.createElement("div", {
      key: post.postId,
      className: "animate-pulse",
      style: {
        animationDelay: `${index * 0.1}s`,
        animationDuration: '1.5s'
      }
    }, /*#__PURE__*/React.createElement(PopularPostSkeleton, null));
  })));
}