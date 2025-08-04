export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  SEARCH: '/search',
  POST: '/post/:id',
  POST_EDIT: '/post/:id/edit',
} as const;

export type RouteKeys = keyof typeof ROUTES;