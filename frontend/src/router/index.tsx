import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/foundation/Layout';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import PostDetailPage from '../pages/PostDetailPage';
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
        path: ROUTES.POST,
        element: <PostDetailPage />,
      },
    ],
  },
])

export { ROUTES }
export type { RouteKeys } from './routes'