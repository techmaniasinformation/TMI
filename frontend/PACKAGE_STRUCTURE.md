# 📦 Frontend 패키지 구조

> 커뮤니티 사이트를 위한 React + Vite + TypeScript 프로젝트의 전체 패키지 구조

## 📁 전체 디렉토리 구조

```
frontend/
├── 📄 package.json
├── 📄 vite.config.ts  
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
│
├── 📁 public/
│   └── favicon.ico
│
└── 📁 src/
    ├── 📄 main.tsx
    ├── 📄 App.tsx
    │
    ├── 📁 assets/               # 정적 자원
    │   ├── fonts/               # 웹폰트
    │   ├── images/              # 이미지 파일
    │   ├── icons/               # 아이콘
    │   └── styles/              # CSS 변수 (색상, 폰트 등)
    │       ├── colors.css
    │       ├── fonts.css
    │       └── variables.css
    │
    ├── 📁 domain_components/    # 도메인별 재사용 컴포넌트
    │   ├── ui/                  # 기본 UI (Button, Input, Modal)
    │   ├── auth/                # 🔐 인증 (SocialLoginForm, AuthModal)
    │   ├── posts/               # 📝 게시글 (PostCard, PostList)
    │   ├── user/                # 👤 사용자 (UserAvatar, ProfileCard)
    │   ├── search/              # 🔍 검색 (SearchBar, SearchFilters)
    │   └── notifications/       # 🔔 알림 (NotificationBell, NotificationItem)
    │
    ├── 📁 pages/                # 페이지별 컴포넌트
    │   ├── LandingPage/         # 🏷️ 1. 랜딩페이지
    │   │   ├── LandingPage.tsx
    │   │   └── layout_components/
    │   │       ├── HeroSection.tsx
    │   │       ├── FeatureSection.tsx
    │   │       └── CTASection.tsx
    │   ├── HomePage/            # 🏷️ 2. 메인페이지
    │   │   ├── HomePage.tsx
    │   │   └── layout_components/
    │   │       ├── MainBanner.tsx
    │   │       ├── PostSection.tsx
    │   │       └── SidebarSection.tsx
    │   ├── AuthPage/            # 🏷️ 3. 소셜로그인페이지
    │   │   ├── AuthPage.tsx
    │   │   └── layout_components/
    │   │       └── LoginContainer.tsx
    │   ├── PostDetailPage/      # 🏷️ 5. 게시글 상세페이지
    │   │   ├── PostDetailPage.tsx
    │   │   └── layout_components/
    │   │       ├── PostContent.tsx
    │   │       ├── CommentSection.tsx
    │   │       └── RecommendedPosts.tsx
    │   ├── PostEditorPage/      # 🏷️ 6. 게시글 작성/수정페이지
    │   │   ├── PostEditorPage.tsx
    │   │   └── layout_components/
    │   │       ├── EditorToolbar.tsx
    │   │       ├── EditorContent.tsx
    │   │       └── PreviewPanel.tsx
    │   ├── SearchPage/          # 🏷️ 7. 검색결과 페이지
    │   │   ├── SearchPage.tsx
    │   │   └── layout_components/
    │   ├── MyPage/              # 🏷️ 8. 마이페이지
    │   │   ├── MyPage.tsx
    │   │   └── layout_components/
    │   └── NotificationsPage/   # 🏷️ 9. 알림페이지
    │       ├── NotificationsPage.tsx
    │       └── layout_components/
    │
    └── 📁 stores/               # 전역 상태 관리
        ├── auth/                # 인증 상태
        ├── posts/               # 게시글 상태
        ├── user/                # 사용자 상태
        ├── ui/                  # UI 상태 (모달, 토스트)
        └── global/              # 전역 설정 (테마, 언어)
```

## 📋 간단한 파일 규칙

- **컴포넌트**: `PascalCase.tsx` (예: `SocialLoginForm.tsx`)
- **훅**: `camelCase.ts` (예: `useAuth.ts`)
- **타입**: `camelCase.types.ts` (예: `auth.types.ts`)
- **스토어**: `camelCase.ts` (예: `authStore.ts`)

## 🔗 Import 예시

```typescript
// 컴포넌트
import { Button } from '@/components/ui'
import { Header } from '@/components/layout'

// 기능별
import { SocialLoginForm } from '@/features/auth'
import { PostList } from '@/features/posts'

// 페이지
import { HomePage } from '@/pages'

// 훅 & 스토어
import { useAuth } from '@/features/auth'
import { authStore } from '@/stores'
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