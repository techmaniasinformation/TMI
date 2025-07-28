// ===== Foundation 컴포넌트들 (모든 페이지에서 사용) =====
export { Button, Layout, Header, Footer } from './foundation';

// ===== Domain 컴포넌트들 (2개 이상 페이지에서 사용) =====
export {
  Tag,
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
  Badge
} from './domain';

// ===== Layout 컴포넌트들 (한 개 페이지에서만 사용) =====
export { PostCard, HomePageContent } from './layout/home';
export { UserProfile } from './layout/mypage';
export { SearchFilter } from './layout/search';

// ===== Inter 컴포넌트들 (특정 컴포넌트 내부에서만 사용) =====
// 현재는 비어있음 - 향후 확장용 