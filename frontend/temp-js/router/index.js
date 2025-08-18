import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/foundation/Layout';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import MyPage from '../pages/MyPage';
import NotificationsPage from '../pages/NotificationsPage';
import PostDetailPage from '../pages/PostDetailPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostEditPage from '../pages/PostEditPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';
import { ROUTES } from './routes';
import { useUserStore } from '@/stores/userStore';
import { useLocation } from 'react-router-dom';

// 로그인 페이지 접근 확인 위함.
function LoginRouteGuard() {
  const location = useLocation();
  const {
    user
  } = useUserStore();
  console.log('[LoginRouteGuard]user:', user);
  const searchParams = new URLSearchParams(location.search); // &&& 수정: location.search 사용
  const isNew = searchParams.get('isNew');
  const queryMemberId = searchParams.get('memberId');
  if (user && !(isNew === 'false' && queryMemberId)) {
    console.log('[LoginRouteGuard] 이미 로그인 상태이므로 홈으로 리다이렉트');
    alert('이미 로그인 되어 있습니다');
    return /*#__PURE__*/React.createElement(Navigate, {
      to: ROUTES.HOME,
      replace: true
    });
  }
  console.log('[LoginRouteGuard] 비로그인 상태, 로그인 페이지 렌더링');
  return /*#__PURE__*/React.createElement(LoginPage, null);
}

// 새 컴포넌트 추가
function MyPageRedirect() {
  const {
    user
  } = useUserStore();
  const myId = user?.memberId;
  if (myId && myId > 0) return /*#__PURE__*/React.createElement(Navigate, {
    to: ROUTES.MEMBER_PAGE(myId),
    replace: true
  });
  return /*#__PURE__*/React.createElement(Navigate, {
    to: ROUTES.HOME,
    replace: true
  }); // 비로그인/ID없음
}
export const router = createBrowserRouter([{
  path: '/',
  element: /*#__PURE__*/React.createElement(Layout, null),
  children: [{
    index: true,
    element: /*#__PURE__*/React.createElement(LandingPage, null)
  }, {
    path: ROUTES.HOME,
    element: /*#__PURE__*/React.createElement(HomePage, null)
  }, {
    // isLogin=treu일 때, home으로 라우팅
    path: ROUTES.LOGIN,
    element: /*#__PURE__*/React.createElement(LoginRouteGuard, null)
  }, {
    path: '/signup',
    element: /*#__PURE__*/React.createElement(SignupPage, null)
  }, {
    path: '/oauth/callback',
    element: /*#__PURE__*/React.createElement(OAuthCallbackPage, null)
  }, {
    path: ROUTES.POST,
    element: /*#__PURE__*/React.createElement(PostDetailPage, null)
  }, {
    path: ROUTES.POST_CREATE,
    element: /*#__PURE__*/React.createElement(PostCreatePage, null)
  }, {
    path: ROUTES.POST_EDIT,
    element: /*#__PURE__*/React.createElement(PostEditPage, null)
  }, {
    path: ROUTES.SEARCH,
    element: /*#__PURE__*/React.createElement(SearchResultsPage, null)
  }, {
    path: ROUTES.MY_PAGE,
    // 내 사용자 마이페이지
    element: /*#__PURE__*/React.createElement(MyPageRedirect, null)
  }, {
    path: '/member/:id',
    // 동적 유저 페이지 라우트 추가
    element: /*#__PURE__*/React.createElement(MyPage, {
      isCompany: false
    })
  }, {
    path: '/company/:id',
    // 동적 기업 페이지 라우트 추가
    element: /*#__PURE__*/React.createElement(MyPage, {
      isCompany: true
    })
  }, {
    path: ROUTES.NOTIFICATIONS,
    element: /*#__PURE__*/React.createElement(NotificationsPage, null)
  }]
}]);
export { ROUTES };