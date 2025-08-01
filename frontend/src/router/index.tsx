import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/foundation/Layout';
import LoginPage from '../pages/LoginPage';

import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import SearchResultsPage from '../pages/SearchResultsPage';
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
        path: ROUTES.SEARCH,
        element: <SearchResultsPage />,
      },
      {
        path: ROUTES.MY_PAGE, // 내 사용자 마이페이지
        element: <MyPage isCompany={false} isMyPage={true} />,
      },
      {
        path: ROUTES.MY_PAGE_COMPANY, // 내 기업 마이페이지
        element: <MyPage isCompany={true} isMyPage={false} />,
      },
      {
        path: ROUTES.MY_PAGE_USER, // 다른 사람의 마이페이지
        element: <MyPage isCompany={false} isMyPage={false} />,
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />,
      },
    ],
  },
])

export { ROUTES }
export type { RouteKeys } from './routes'