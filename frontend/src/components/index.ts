// ===== Foundation 컴포넌트들 (모든 페이지에서 사용) =====
export { Button, Layout, Header, Footer } from './foundation';

// ===== Domain 컴포넌트들 (2개 이상 페이지에서 사용) =====
export {
  Input,
  Label,
  Dialog,
  Tabs,
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

// Article 관련 컴포넌트들 (article 폴더)
export {
  UserInfo,
  CardInfoCount,
  ArticleInfo,
  Tag,
  TagArea,
  DateTimeComponent,
} from './domain/article';

// ===== Layout 컴포넌트들 (한 개 페이지에서만 사용) =====
export { UserProfile } from './layout/mypage';
export { SearchFilter } from './layout/search';

// ===== Inter 컴포넌트들 (특정 컴포넌트 내부에서만 사용) =====
export * from './inter'; 