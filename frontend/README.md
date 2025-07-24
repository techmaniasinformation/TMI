# 🏗️ Frontend 프로젝트 구조

> 커뮤니티 사이트를 위한 React + Vite + TypeScript 프로젝트 구조

## 📁 프로젝트 구조 개요

```
frontend/src/
├── 📁 components/           # 공통 컴포넌트 (ui, layout, common)
├── 📁 features/             # 도메인별 기능 (auth, posts, user, search, notifications)
├── 📁 pages/                # 페이지 컴포넌트
├── 📁 hooks/                # 전역 커스텀 훅
├── 📁 stores/               # 전역 상태 관리 (Zustand)
├── 📁 utils/                # 유틸리티 함수
├── 📁 types/                # 전역 타입 정의
└── 📁 assets/               # 정적 자원 (이미지, 아이콘)
```

---

## 🎯 구현할 9개 페이지

1. **랜딩페이지** - 서비스 소개 및 첫 진입점
2. **메인페이지** - 게시글 목록 및 메인 대시보드
3. **소셜로그인페이지** - 소셜 인증
4. **헤더바** - 전역 네비게이션 (레이아웃 컴포넌트)
5. **게시글 상세페이지** - 개별 게시글 내용 표시
6. **게시글 작성/수정페이지** - 게시글 CRUD
7. **검색결과 페이지** - 검색 기능 및 결과 표시
8. **마이페이지** - 사용자 프로필 및 설정
9. **알림페이지** - 사용자 알림 관리

---

## 📂 간단한 컴포넌트 구조

### 🏗️ **components/** - 공통 컴포넌트
```
components/
├── ui/                    # 기본 UI 컴포넌트 (Button, Input, Modal, Card)
├── layout/                # 레이아웃 컴포넌트 (Header, Footer)
└── common/                # 재사용 컴포넌트 (SearchBar, Pagination)
```

### 🎯 **features/** - 도메인별 기능 모듈
```
features/
├── auth/                  # 🔐 소셜로그인
│   ├── SocialLoginForm.tsx
│   ├── useAuth.ts
│   └── auth.types.ts
├── posts/                 # 📝 게시글
│   ├── PostList.tsx
│   ├── PostDetail.tsx
│   ├── PostEditor.tsx
│   ├── usePosts.ts
│   └── post.types.ts
├── user/                  # 👤 사용자
│   ├── ProfileCard.tsx
│   ├── useUser.ts
│   └── user.types.ts
├── search/                # 🔍 검색
│   ├── SearchResults.tsx
│   ├── useSearch.ts
│   └── search.types.ts
└── notifications/         # 🔔 알림
    ├── NotificationList.tsx
    ├── useNotifications.ts
    └── notification.types.ts
```

### 📄 **pages/** - 페이지 컴포넌트
```
pages/
├── LandingPage.tsx        # 🏷️ 1. 랜딩페이지
├── HomePage.tsx           # 🏷️ 2. 메인페이지  
├── AuthPage.tsx           # 🏷️ 3. 소셜로그인페이지
├── PostDetailPage.tsx     # 🏷️ 5. 게시글 상세페이지
├── PostEditorPage.tsx     # 🏷️ 6. 게시글 작성/수정페이지
├── SearchPage.tsx         # 🏷️ 7. 검색결과 페이지
├── MyPage.tsx             # 🏷️ 8. 마이페이지
└── NotificationsPage.tsx  # 🏷️ 9. 알림페이지
```

### 🪝 **hooks/** - 전역 커스텀 훅
```
hooks/
├── useApi.ts              # API 호출 공통 로직
├── useDebounce.ts         # 디바운스 훅
└── useLocalStorage.ts     # 로컬 스토리지 관리
```

### 🗄️ **stores/** - 전역 상태 관리 (Zustand)
```
stores/
├── authStore.ts           # 인증 상태
├── uiStore.ts            # UI 상태 (모달, 토스트, 로딩)
└── globalStore.ts         # 전역 설정 (테마, 언어)
```

---

## 👥 3명 개발자 분업 계획

### 🔵 **개발자 A - 인증 & 검색 담당**
**담당 페이지**: 1, 3, 7 + 헤더바
- **features/auth/** - 소셜 로그인 기능
- **features/search/** - 검색 기능
- **pages/**: LandingPage, AuthPage, SearchPage
- **components/layout/Header** - 헤더바

### 🟢 **개발자 B - 게시글 & 메인 담당**
**담당 페이지**: 2, 5, 6
- **features/posts/** - 게시글 관련 모든 기능
- **pages/**: HomePage, PostDetailPage, PostEditorPage

### 🟡 **개발자 C - 사용자 & 알림 담당**
**담당 페이지**: 8, 9
- **features/user/** - 사용자 프로필 관리
- **features/notifications/** - 알림 시스템
- **pages/**: MyPage, NotificationsPage

---

## 🗂️ 라우팅 구조

```typescript
// 예상 라우팅 구조
const routes = [
  { path: '/', component: LandingPage },              // 1. 랜딩페이지
  { path: '/home', component: HomePage },             // 2. 메인페이지
  { path: '/auth', component: AuthPage },             // 3. 소셜로그인
  { path: '/post/:id', component: PostDetailPage },   // 5. 게시글 상세
  { path: '/write', component: PostEditorPage },      // 6. 게시글 작성
  { path: '/edit/:id', component: PostEditorPage },   // 6. 게시글 수정
  { path: '/search', component: SearchPage },  // 7. 검색결과
  { path: '/profile', component: MyPage },            // 8. 마이페이지
  { path: '/notifications', component: NotificationsPage }, // 9. 알림
  { path: '*', component: NotFoundPage },             // 404 페이지
]
```

---

## 📋 개발 가이드라인

### **간단한 규칙**
- **컴포넌트**: PascalCase.tsx (SocialLoginForm.tsx)
- **훅**: camelCase.ts (useAuth.ts)
- **타입**: camelCase.types.ts (auth.types.ts)

### **Import 예시**
```typescript
// 절대 경로 사용 (@/ 별칭 설정)
import { Button } from '@/components/ui'
import { SocialLoginForm } from '@/features/auth'
import { useAuth } from '@/features/auth'
```

---

## 🗓️ 3주 개발 일정

### **1주차**: 기반 구축 + 핵심 페이지
- 공통 컴포넌트 (Header, UI 컴포넌트)
- 개발자A: 랜딩페이지 + 소셜로그인페이지
- 개발자B: 메인페이지 + 게시글 상세페이지
- 개발자C: 마이페이지 기본 구조

### **2주차**: 심화 기능 개발
- 개발자A: 검색 기능
- 개발자B: 게시글 작성/수정 에디터
- 개발자C: 알림 시스템

### **3주차**: 통합 및 완성
- 기능 통합 및 테스트
- 버그 수정 및 최적화
- UI/UX 개선

---

## 🚀 시작하기

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **빌드**
   ```bash
   npm run build
   ```

4. **테스트**
   ```bash
   npm test
   ```

---

## 🛠️ 기술 스택

- **React** 19.1.0 + **TypeScript** 5.7.2
- **Vite** 6.0.7 (빌드 도구)
- **Tailwind CSS** 3.4.17 (스타일링)
- **Zustand** 5.0.6 (상태 관리)
- **Vitest** 2.1.8 (테스팅)

---

## 🎯 핵심 포인트

1. **features/** - 각 도메인별로 관련 파일들을 한 곳에 모음
2. **components/** - 재사용 가능한 공통 컴포넌트 3개 카테고리
3. **pages/** - 라우트별 단일 페이지 컴포넌트
4. **stores/** - 전역 상태 관리 (Zustand)

> 💡 **직관적이고 단순한 구조**로 빠른 개발과 유지보수를 지원합니다.