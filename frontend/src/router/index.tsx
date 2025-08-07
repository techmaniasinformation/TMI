import { createBrowserRouter } from 'react-router-dom';
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
import { ROUTES } from './routes';

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
        path: ROUTES.LOGIN,
        element: <LoginPage />,
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
      {
        path: ROUTES.MY_PAGE,
        element: <MyPage isCompany={false} isMyPage={true} />,
      },
      {
        path: ROUTES.MY_PAGE_COMPANY,
        element: <MyPage isCompany={true} isMyPage={false} />,
      },
      {
        path: ROUTES.MY_PAGE_USER,
        element: <MyPage isCompany={false} isMyPage={false} />,
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