// 라우터 설정
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes'

// 레이아웃 컴포넌트 import
import Layout from '../components/layout/Layout'

// 페이지 컴포넌트들 import
import LandingPage from '../pages/LandingPage/LandingPage'
import HomePage from '../pages/HomePage/HomePage'
import LoginPage from '../pages/AuthPage/LoginPage'
import SignupPage from '../pages/AuthPage/SignupPage'
import PostDetailPage from '../pages/PostDetailPage/PostDetailPage'
import PostEditorPage from '../pages/PostEditorPage/PostEditorPage'
import SearchResultsPage from '../pages/SearchPage/SearchResultsPage'
import MyPage from '../pages/MyPage/MyPage'
import NotificationsPage from '../pages/NotificationsPage/NotificationsPage'

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