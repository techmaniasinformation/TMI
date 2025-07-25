export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  LOGIN: '/login',
  POST_DETAIL: '/posts/:id',
  POST_EDITOR: '/posts/editor',
  SEARCH: '/search',
  MY_PAGE: '/my-page',
  NOTIFICATIONS: '/notifications',
} as const;

export type RouteKeys = keyof typeof ROUTES;