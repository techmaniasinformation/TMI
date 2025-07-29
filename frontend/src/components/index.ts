// ===== Foundation 컴포넌트들 (모든 페이지에서 사용) =====
export { Button, Layout, Header, Footer } from './foundation';

// ===== Domain 컴포넌트들 (2개 이상 페이지에서 사용) =====
export {
  Textarea,
  Tooltip,
  Input,
  Label,
  Dialog,
  Tabs,
  Switch,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PageCard,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
} from './domain';

// Default export 컴포넌트들
export { default as UserInfo } from './domain/UserInfo';
export { default as CardInfoCount } from './domain/CardInfoCount';
export { default as ArticleInfo } from './domain/ArticleInfo';
export { default as Tag } from './domain/Tag';
export { default as TagArea } from './domain/TagArea';
export { default as DateTimeComponent } from './domain/DateTimeComponent';

// ===== Layout 컴포넌트들 (한 개 페이지에서만 사용) =====
export { UserProfile } from './layout/mypage';
export { SearchFilter } from './layout/search';

// ===== Inter 컴포넌트들 (특정 컴포넌트 내부에서만 사용) =====
export * from './inter'; 