import { useState, useEffect, useCallback } from 'react';
import { usePostsList } from '@/hooks/posts/usePostsList';
import HomeTabBar from './HomeTabBar';
import PostList from './article/PostList';
import ServerPagination from './ServerPagination';
import { Card, CardContent } from '@/components/domain/Card';
import { Button } from '@/components/foundation/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSafeThumbnailUrl } from '@/utils/defaultImages';
import { PostCardSkeleton } from '@/components/foundation/Skeleton';
// 탭 설정
const HOME_TABS = [{
  id: 'latest',
  label: '최신순',
  icon: 'fas fa-clock'
}, {
  id: 'following',
  label: '팔로우순',
  icon: 'fas fa-users'
}];
export default function HomePostList() {
  const navigate = useNavigate();
  const {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    isLast,
    currentTab,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber,
    isLoggedIn
  } = usePostsList();

  // URL에서 followMemberId 확인
  const [searchParams] = useSearchParams();
  const followMemberId = searchParams.get('followMemberId');

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
  }, [loading, posts]);

  // 초기 로드 완료 후 이미지 프리로딩 시작
  useEffect(() => {
    if (!loading && posts.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, posts, isInitialLoad]);

  // 로딩 중일 때 스켈레톤 표시 (팔로우 탭에서 로그인하지 않았을 때는 제외)
  if (loading && !(currentTab === 'following' && (!isLoggedIn || followMemberId === 'guest'))) {
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, [1, 2, 3, 4, 5].map(index => /*#__PURE__*/React.createElement(PostCardSkeleton, {
      key: index
    })));
  }

  // 에러 상태
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-6"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exclamation-triangle text-6xl text-red-300 dark:text-red-400 mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-semibold text-red-600 dark:text-red-500 mb-2"
    }, "\uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
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
    }), "\uC774\uC804 \uD398\uC774\uC9C0\uB85C")));
  }

  // 로그인 필요 카드 렌더링
  const renderLoginRequiredCard = () => {
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-6"
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-users text-4xl text-gray-400 dark:text-gray-500 mb-4"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
    }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uC758 \uAC8C\uC2DC\uAE00"), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 dark:text-gray-400 mb-4"
    }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uB4E4\uC758 \uCD5C\uC2E0 \uAC8C\uC2DC\uAE00\uC744 \uD655\uC778\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4")), /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: () => navigate('/login'),
      className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg border-none"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-sign-in-alt mr-2"
    }), "\uB85C\uADF8\uC778")))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(HomeTabBar, {
    tabs: HOME_TABS,
    activeTab: currentTab,
    onTabChange: tabId => {
      console.log('🔍 HomeTabBar에서 탭 클릭:', tabId);

      // 팔로우 탭으로 변경하려고 하는데 로그인하지 않은 경우
      if (tabId === 'following' && !isLoggedIn) {
        console.log('🔍 팔로우 탭 클릭했지만 로그인하지 않음');
        setActiveTab(tabId);
        return;
      }

      // 탭 변경 시 페이지를 1로 초기화
      setCurrentPage(1);
      setActiveTab(tabId);
    }
  }), !isInitialLoad && /*#__PURE__*/React.createElement("div", {
    className: "hidden"
  }, posts.map(post => /*#__PURE__*/React.createElement("img", {
    key: post.postId,
    src: getSafeThumbnailUrl(post.thumbnailUrl),
    alt: "",
    onLoad: () => handleImageLoad(post.postId),
    onError: () => handleImageLoad(post.postId) // 에러 시에도 로드 완료로 처리
  }))), currentTab === 'following' && /*#__PURE__*/React.createElement("div", null, !isLoggedIn || followMemberId === 'guest' ?
  // 로그인하지 않은 경우 로그인 안내
  renderLoginRequiredCard() :
  /*#__PURE__*/
  // 팔로우한 모든 사람들의 게시글 목록
  React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900 dark:text-gray-100"
  }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uB4E4\uC758 \uAC8C\uC2DC\uAE00"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400 mt-1"
  }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uB4E4\uC758 \uCD5C\uC2E0 \uAC8C\uC2DC\uAE00\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), posts.length > 0 ? /*#__PURE__*/React.createElement(PostList, {
    posts: posts,
    formatDate: formatDate,
    formatNumber: formatNumber,
    onPostClick: handlePostClick,
    showThumbnail: true,
    maxTags: 5,
    className: "mb-8"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-alt text-6xl text-gray-300 dark:text-gray-600 mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold text-gray-600 mb-2"
  }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uC758 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "\uD314\uB85C\uC6B0\uD55C \uC0AC\uC6A9\uC790\uB4E4\uC774 \uC544\uC9C1 \uAC8C\uC2DC\uAE00\uC744 \uC791\uC131\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")))), currentTab === 'latest' && posts.length > 0 && /*#__PURE__*/React.createElement(PostList, {
    posts: posts,
    formatDate: formatDate,
    formatNumber: formatNumber,
    onPostClick: handlePostClick,
    showThumbnail: true,
    maxTags: 5,
    className: "mb-8"
  }), totalPages > 1 && (currentTab === 'latest' || currentTab === 'following' && isLoggedIn && followMemberId !== 'guest') && /*#__PURE__*/React.createElement(ServerPagination, {
    currentPage: currentPage,
    totalCount: totalElements,
    pageSize: 10,
    onPageChange: setCurrentPage
  }));
}