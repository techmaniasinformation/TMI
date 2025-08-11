import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
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

// 로그인 페이지 접근 확인 위함.
function LoginRouteGuard() {
  const location = useLocation();  // &&& 추가: useLocation 훅 사용해서 현재 location 가져오기
  const { memberId } = useUserStore();

  const searchParams = new URLSearchParams(location.search);  // &&& 수정: location.search 사용
  const isNew = searchParams.get('isNew');
  const queryMemberId = searchParams.get('memberId');

  // &&& 수정: memberId가 -1이 아니고, 쿼리가 isNew=false & memberId가 아닐 때만 "이미 로그인" 알림 띄우기
  if (memberId !== -1 && !(isNew === 'false' && queryMemberId)) {
    alert('이미 로그인 되어 있습니다');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <LoginPage />;
}

// 새 컴포넌트 추가
function MyPageRedirect() {
  const { user, memberId } = useUserStore();
  const myId = user?.memberId ?? memberId;

  if (myId && myId > 0) return <Navigate to={ROUTES.MEMBER_PAGE(myId)} replace />;
  return <Navigate to={ROUTES.HOME} replace />; // 비로그인/ID없음
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        // isLogin=true일 때, home으로 라우팅
        path: ROUTES.LOGIN,
        element: <LoginRouteGuard />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/oauth/callback',
        element: <OAuthCallbackPage />,
      },
      {
        path: ROUTES.POST,
        element: <PostDetailPage />,
      },
      {
        path: ROUTES.POST_CREATE,
        element: <PostCreatePage />,
      },
      {
        path: ROUTES.POST_EDIT,
        element: <PostEditPage />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchResultsPage />,
      },
      {
        path: ROUTES.MY_PAGE, // 내 사용자 마이페이지
        element: <MyPageRedirect />
      },
      
      {
        path: '/member/:id', // 동적 유저 페이지 라우트 추가
        element: <MyPage isCompany={false} />,
      },

      {
        path: '/company/:id', // 동적 기업 페이지 라우트 추가
        element: <MyPage isCompany={true} />,
      },

      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />,
      },
    ],
  },
]);

export { ROUTES };
export type { RouteKeys } from './routes';