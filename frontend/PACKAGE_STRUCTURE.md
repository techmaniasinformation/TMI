# 📦 Frontend 패키지 구조

> 커뮤니티 사이트를 위한 React + Vite + TypeScript 프로젝트의 전체 패키지 구조

## 📁 전체 디렉토리 구조

```
frontend/
├── 📄 package.json
├── 📄 vite.config.ts  
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 README.md
├── 📄 PACKAGE_STRUCTURE.md
│
├── 📁 public/
│   └── favicon.ico
│
└── 📁 src/
    ├── 📄 main.tsx
    ├── 📄 App.tsx
    ├── 📄 index.css
    │
    ├── 📁 assets/               # 📦 정적 자원
    │   ├── fonts/               # 웹폰트 파일
    │   │   └── .gitkeep
    │   ├── images/              # 이미지 파일  
    │   │   └── .gitkeep
    │   ├── icons/               # 아이콘 파일
    │   │   └── .gitkeep
    │   └── styles/              # CSS 변수 (색상, 폰트, 사이즈)
    │       ├── colors.css       # 색상 변수
    │       ├── fonts.css        # 폰트 변수
    │       └── variables.css    # 기타 CSS 변수
    │
    ├── 📁 domain_components/    # 🎯 도메인별 재사용 컴포넌트
    │   ├── ui/                  # 기본 UI 컴포넌트
    │   │   └── .gitkeep         # Button, Input, Modal 등
    │   ├── auth/                # 🔐 인증 관련
    │   │   └── .gitkeep         # SocialLoginForm, AuthModal 등
    │   ├── posts/               # 📝 게시글 관련
    │   │   └── .gitkeep         # PostCard, PostList 등
    │   ├── user/                # 👤 사용자 관련
    │   │   └── .gitkeep         # UserAvatar, ProfileCard 등
    │   ├── search/              # 🔍 검색 관련
    │   │   └── .gitkeep         # SearchBar, SearchFilters 등
    │   └── notifications/       # 🔔 알림 관련
    │       └── .gitkeep         # NotificationBell, NotificationItem 등
    │
    ├── 📁 pages/                # 📄 페이지별 컴포넌트
    │   ├── LandingPage/         # 🏷️ 1. 랜딩페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # HeroSection, FeatureSection, CTASection
    │   ├── HomePage/            # 🏷️ 2. 메인페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # MainBanner, PostSection, SidebarSection
    │   ├── AuthPage/            # 🏷️ 3. 소셜로그인페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # LoginContainer
    │   ├── PostDetailPage/      # 🏷️ 5. 게시글 상세페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # PostContent, CommentSection, RecommendedPosts
    │   ├── PostEditorPage/      # 🏷️ 6. 게시글 작성/수정페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # EditorToolbar, EditorContent, PreviewPanel
    │   ├── SearchPage/          # 🏷️ 7. 검색결과 페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # SearchFilters, SearchResults
    │   ├── MyPage/              # 🏷️ 8. 마이페이지
    │   │   └── layout_components/
    │   │       └── .gitkeep     # ProfileSection, PostsSection, SettingsSection
    │   └── NotificationsPage/   # 🏷️ 9. 알림페이지
    │       └── layout_components/
    │           └── .gitkeep     # NotificationList, NotificationFilters
    │
    └── 📁 stores/               # 🗄️ 전역 상태 관리 (Zustand)
        ├── auth/                # 인증 상태
        │   └── .gitkeep         # authStore.ts
        ├── posts/               # 게시글 상태
        │   └── .gitkeep         # postsStore.ts
        ├── user/                # 사용자 상태
        │   └── .gitkeep         # userStore.ts
        ├── ui/                  # UI 상태 (모달, 토스트, 로딩)
        │   └── .gitkeep         # uiStore.ts
        ├── global/              # 전역 설정 (테마, 언어)
        │   └── .gitkeep         # globalStore.ts
        ├── counterStore.ts      # 기존 예시 스토어
        └── index.ts             # 스토어 통합 export
```

## 📋 간단한 파일 규칙

- **컴포넌트**: `PascalCase.tsx` (예: `SocialLoginForm.tsx`)
- **훅**: `camelCase.ts` (예: `useAuth.ts`)
- **타입**: `camelCase.types.ts` (예: `auth.types.ts`)
- **스토어**: `camelCase.ts` (예: `authStore.ts`)

## 🔗 Import 예시

```typescript
// 도메인 컴포넌트
import { Button } from '@/domain_components/ui'
import { SocialLoginForm } from '@/domain_components/auth'
import { PostCard } from '@/domain_components/posts'
import { UserAvatar } from '@/domain_components/user'

// 페이지 레이아웃 컴포넌트
import { HeroSection } from '@/pages/LandingPage/layout_components'
import { LoginContainer } from '@/pages/AuthPage/layout_components'

// 스토어
import { authStore } from '@/stores/auth'
import { uiStore } from '@/stores/ui'

// 스타일
import '@/assets/styles/colors.css'
import '@/assets/styles/fonts.css'
```

## 📦 주요 기술 스택

- **React** 19.1.0 + **TypeScript** 5.7.2
- **Vite** 6.0.7 (빌드 도구)
- **Tailwind CSS** 3.4.17 (스타일링)
- **Zustand** 5.0.6 (상태 관리)
- **Vitest** 2.1.8 (테스팅)

## 🎯 단순하고 직관적인 구조

### 📦 **4개 폴더 구조**

#### 📁 **assets/** - 정적 자원
- **fonts/**: 웹폰트 파일
- **images/**: 이미지 파일  
- **icons/**: 아이콘 파일
- **styles/**: CSS 변수 (색상, 폰트, 사이즈 등)

#### 🎯 **domain_components/** - 도메인별 재사용 컴포넌트
- **ui/**: 기본 UI 컴포넌트 (Button, Input, Modal)
- **auth/**: 인증 관련 (SocialLoginForm, AuthModal)
- **posts/**: 게시글 관련 (PostCard, PostList)
- **user/**: 사용자 관련 (UserAvatar, ProfileCard)
- **search/**: 검색 관련 (SearchBar, SearchFilters)
- **notifications/**: 알림 관련 (NotificationBell, NotificationItem)

#### 📄 **pages/** - 페이지별 컴포넌트
각 페이지마다 `layout_components/` 폴더 포함:
- **LandingPage/layout_components/**: HeroSection, FeatureSection, CTASection
- **HomePage/layout_components/**: MainBanner, PostSection, SidebarSection
- **AuthPage/layout_components/**: LoginContainer
- **PostDetailPage/layout_components/**: PostContent, CommentSection, RecommendedPosts
- **PostEditorPage/layout_components/**: EditorToolbar, EditorContent, PreviewPanel

#### 🗄️ **stores/** - 전역 상태 관리
- **auth/**: 인증 상태
- **posts/**: 게시글 상태  
- **user/**: 사용자 상태
- **ui/**: UI 상태 (모달, 토스트, 로딩)
- **global/**: 전역 설정 (테마, 언어)

## 📋 배치 기준

- **2개 이상 페이지에서 재사용** → `domain_components/`
- **해당 페이지에서만 사용** → `pages/[PageName]/layout_components/`
- **정적 자원** → `assets/`
- **전역 상태** → `stores/`

> 💡 **극도로 단순한 구조**: 4개 폴더만으로 모든 코드를 명확하게 분리하여 개발자가 고민 없이 파일을 배치할 수 있습니다.