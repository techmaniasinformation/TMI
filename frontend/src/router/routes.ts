export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  SEARCH: '/search',
  POST: '/post/:id',
} as const;

export type RouteKeys = keyof typeof ROUTES;