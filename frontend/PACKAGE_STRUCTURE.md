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
    ├── 📁 components/           # 공통 컴포넌트
    │   ├── ui/                  # 기본 UI (Button, Input, Modal)
    │   ├── layout/              # 레이아웃 (Header, Footer)
    │   └── common/              # 재사용 (SearchBar, Pagination)
    │
    ├── 📁 features/             # 도메인별 기능
    │   ├── auth/                # 🔐 소셜로그인
    │   │   ├── SocialLoginForm.tsx
    │   │   ├── useAuth.ts
    │   │   └── auth.types.ts
    │   ├── posts/               # 📝 게시글
    │   │   ├── PostList.tsx
    │   │   ├── PostDetail.tsx
    │   │   ├── PostEditor.tsx
    │   │   ├── usePosts.ts
    │   │   └── post.types.ts
    │   ├── user/                # 👤 사용자
    │   │   ├── ProfileCard.tsx
    │   │   ├── useUser.ts
    │   │   └── user.types.ts
    │   ├── search/              # 🔍 검색
    │   │   ├── SearchResults.tsx
    │   │   ├── useSearch.ts
    │   │   └── search.types.ts
    │   └── notifications/       # 🔔 알림
    │       ├── NotificationList.tsx
    │       ├── useNotifications.ts
    │       └── notification.types.ts
    │
    ├── 📁 pages/                # 페이지 컴포넌트
    │   ├── LandingPage.tsx      # 🏷️ 1. 랜딩
    │   ├── HomePage.tsx         # 🏷️ 2. 메인  
    │   ├── AuthPage.tsx         # 🏷️ 3. 소셜로그인
    │   ├── PostDetailPage.tsx   # 🏷️ 5. 게시글 상세
    │   ├── PostEditorPage.tsx   # 🏷️ 6. 게시글 작성/수정
    │   ├── SearchPage.tsx       # 🏷️ 7. 검색결과
    │   ├── MyPage.tsx           # 🏷️ 8. 마이페이지
    │   └── NotificationsPage.tsx # 🏷️ 9. 알림
    │
    ├── 📁 hooks/                # 전역 커스텀 훅
    │   ├── useApi.ts
    │   ├── useDebounce.ts
    │   └── useLocalStorage.ts
    │
    ├── 📁 stores/               # 전역 상태 (Zustand)
    │   ├── authStore.ts
    │   ├── uiStore.ts
    │   └── globalStore.ts
    │
    ├── 📁 utils/                # 유틸리티
    │   ├── api.ts
    │   ├── constants.ts
    │   └── helpers.ts
    │
    ├── 📁 types/                # 전역 타입
    │   └── global.types.ts
    │
    └── 📁 assets/               # 정적 자원
        ├── images/
        └── icons/
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

## 🎯 핵심 구조 포인트

1. **features/** - 각 도메인별로 관련 파일들을 한 곳에 모음
2. **components/** - 재사용 가능한 공통 컴포넌트
3. **pages/** - 라우트별 페이지 컴포넌트
4. **stores/** - 전역 상태 관리 (Zustand)

> 💡 **직관적이고 단순한 구조**로 빠른 개발과 유지보수를 지원합니다.