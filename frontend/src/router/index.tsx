import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import MyPage from '../pages/MyPage';
import NotificationsPage from '../pages/NotificationsPage';
import PostDetailPage from '../pages/PostDetailPage';
import PostEditorPage from '../pages/PostEditorPage';
import SearchResultsPage from '../pages/SearchResultsPage';
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
        path: ROUTES.POST_DETAIL,
        element: <PostDetailPage />,
      },
      {
        path: ROUTES.POST_EDITOR,
        element: <PostEditorPage />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchResultsPage />,
      },
      {
        path: ROUTES.MY_PAGE,
        element: <MyPage />,
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