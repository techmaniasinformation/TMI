export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  LOGIN: '/login',
  SEARCH: '/search',
  POST: '/post/:id',
  POST_CREATE: '/post/create',
  POST_EDIT: '/post/:id/edit',
  MY_PAGE: '/my-page',               // 기본 사용자 마이페이지
  NOTIFICATIONS: '/notifications',
  MEMBER_PAGE: (id: number | string) => `/member/${id}`,
  COMPANY_PAGE: (id: number | string) => `/company/${id}`,
} as const;

export type RouteKeys = keyof typeof ROUTES;