import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/foundation/Layout';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import MyPage from '../pages/MyPage';
import NotificationsPage from '../pages/NotificationsPage';
import PostDetailPage from '../pages/PostDetailPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostEditPage from '../pages/PostEditPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import SignupPage from '../pages/SignupPage';
import { ROUTES } from './routes';
import { useUserStore } from '@/stores/userStore';
import { Navigate } from 'react-router-dom';

// 로그인 페이지 접근 확인 위함.
function LoginRouteGuard() {
  const { isLogin } = useUserStore();

  if (isLogin) {
    alert('이미 로그인 되어 있습니다');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <LoginPage />;
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
        // isLogin=treu일 때, home으로 라우팅
        path: ROUTES.LOGIN,
        element: <LoginRouteGuard />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
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
      // {
      //   path: ROUTES.MY_PAGE, // 내 사용자 마이페이지
      //   element: <MyPage isCompany={false} isMyPage={true} />,
      // },
      // {
      //   path: ROUTES.MY_PAGE_COMPANY, // 내 기업 마이페이지
      //   element: <MyPage isCompany={true} isMyPage={false} />,
      // },
      // {
      //   path: ROUTES.MY_PAGE_USER, // 다른 사람의 마이페이지
      //   element: <MyPage isCompany={false} isMyPage={false} />,
      // },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />,
      },
    ],
  },
]);

export { ROUTES };
export type { RouteKeys } from './routes';
