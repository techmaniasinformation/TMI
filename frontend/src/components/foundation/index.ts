// Foundation 컴포넌트들 - 모든 페이지에서 사용
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as SearchBar } from './SearchBar';
export { default as CustomAlert } from './CustomAlert';
export { Button } from './button';

// Skeleton 컴포넌트들
export { 
  Skeleton, 
  SearchResultSkeleton, 
  PostCardSkeleton, 
  PopularPostSkeleton 
} from './Skeleton';

// ErrorState 컴포넌트들
export { 
  ErrorState, 
  DefaultErrorActions 
} from './ErrorState';

// EmptyState 컴포넌트들
export { 
  EmptyState, 
  SearchTips, 
  NoResultsTips 
} from './EmptyState'; 