// Layout 컴포넌트들 - 한 개 페이지에서만 사용하지만 재사용 가능성 있음

// MyPage 전용
export * from './mypage';

// SearchPage 전용
export { SearchFilter, SearchConditions, Pagination, NoResults } from './search';
export { PostCard as SearchPostCard } from './search';

// PostsPage 전용 (향후 확장)
// export * from './posts';

// AuthPage 전용 (향후 확장)
// export * from './auth';

// NotificationsPage 전용 (향후 확장)
// export * from './notifications'; 