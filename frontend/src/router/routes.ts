export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  SEARCH: '/search',
  MY_PAGE: '/my-page',               // 기본 사용자 마이페이지
  MY_PAGE_USER: '/my-page-user',     // 사용자용 테스트 라우트
  MY_PAGE_COMPANY: '/my-page-company', // 기업용 테스트 라우트
  NOTIFICATIONS: '/notifications',
} as const;

export type RouteKeys = keyof typeof ROUTES;