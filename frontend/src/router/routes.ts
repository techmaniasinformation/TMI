// 경로 정의
export const ROUTES = {
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/login',
  POST_DETAIL: '/posts/:id',
  POST_EDITOR: '/posts/editor',
  SEARCH: '/search',
  MY_PAGE: '/my-page',
  NOTIFICATIONS: '/notifications',
} as const

export type RouteKeys = keyof typeof ROUTES