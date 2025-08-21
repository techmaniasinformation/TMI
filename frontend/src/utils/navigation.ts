// 네비게이션 관련 유틸리티
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  POST: '/post/:id',
  POST_CREATE: '/post/create',
  POST_EDIT: '/post/:id/edit',
  SEARCH: '/search',
  MY_PAGE: '/mypage',
  NOTIFICATIONS: '/notifications',
  MEMBER_PAGE: (id: number) => `/member/${id}`,
  COMPANY_PAGE: (id: number) => `/company/${id}`,
} as const;

export type RouteKeys = keyof typeof ROUTES;
