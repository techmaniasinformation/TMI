export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  SEARCH: '/search',
} as const;

export type RouteKeys = keyof typeof ROUTES;