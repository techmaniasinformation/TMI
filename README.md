# Frontend Project Structure

## 📁 폴더 구조

```
src/
├── components/          # 모든 컴포넌트들
│   ├── ui/             # 공통 UI 컴포넌트 (Button, Input 등)
│   ├── posts/          # Posts 도메인 컴포넌트
│   ├── user/           # User 도메인 컴포넌트
│   ├── notifications/  # Notifications 도메인 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer 등)
│   ├── search/         # Search 도메인 컴포넌트
│   ├── auth/           # Auth 도메인 컴포넌트
│   ├── index.ts        # 통합 export
│   ├── manager.tsx     # 컴포넌트 매니저
│   ├── paths.ts        # 컴포넌트 경로 설정
│   └── README.md       # 컴포넌트 관리 문서
│
├── pages/              # 페이지 컴포넌트들
│   ├── HomePage/
│   ├── MyPage/
│   ├── PostDetailPage/
│   ├── PostEditorPage/
│   ├── NotificationsPage/
│   ├── SearchPage/
│   ├── AuthPage/
│   └── LandingPage/
│
├── features/           # 기능별 모듈 (향후 확장용)
│
├── hooks/              # 커스텀 훅들
│
├── stores/             # 상태 관리 (Zustand 등)
│
├── styles/             # 스타일 파일들
│   ├── App.css
│   ├── index.css
│   └── variables.css
│
├── utils/              # 유틸리티 함수들
│   └── utils.ts        # cn 함수 등
│
├── routes/             # 라우팅 설정
│   ├── index.tsx       # 라우터 설정
│   └── routes.ts       # 라우트 상수
│
├── assets/             # 정적 파일들
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
│   ├── react-app-env.d.ts
│   ├── logo.svg
│   ├── clean.tsx
│   └── App.test.tsx
│
├── types/              # TypeScript 타입 정의
│
├── api/                # API 관련 파일들
│
├── App.tsx             # 메인 앱 컴포넌트
└── index.tsx           # 앱 진입점
```

## 🎯 폴더별 역할

### **components/**
- 모든 UI 컴포넌트들이 위치
- 도메인별로 구분되어 관리
- 재사용 가능한 컴포넌트들
- 통합 export를 통한 간편한 import

### **pages/**
- 실제 페이지 컴포넌트들
- 라우팅과 연결되는 최상위 컴포넌트들
- 비즈니스 로직과 UI 로직이 결합

### **features/** (향후 확장용)
- 기능별 모듈화
- 도메인별 비즈니스 로직
- API 호출, 상태 관리 등

### **hooks/**
- 커스텀 React 훅들
- 재사용 가능한 로직들

### **stores/**
- 전역 상태 관리
- Zustand 스토어들

### **styles/**
- CSS 파일들
- 전역 스타일 설정

### **utils/**
- 유틸리티 함수들
- 헬퍼 함수들

### **routes/**
- 라우팅 설정
- 라우트 상수 정의

### **assets/**
- 정적 파일들
- 이미지, 아이콘, 폰트 등

### **types/**
- TypeScript 타입 정의
- 인터페이스, 타입 등

### **api/**
- API 관련 파일들
- API 클라이언트, 인터셉터 등

## 🚀 사용 방법

### 컴포넌트 import
```tsx
// 통합 import 사용
import {
  Button,
  Tag,
  Card,
  CardContent,
  ComponentManager,
  componentKeys
} from '@/components';
```

### 라우팅
```tsx
import { router } from '@/routes';
```

### 유틸리티
```tsx
import { cn } from '@/utils/utils';
```

### 스타일
```tsx
import '@/styles/App.css';
```

## 📝 주의사항

1. **컴포넌트 추가 시**: `components/index.ts`에 export 추가
2. **새로운 도메인**: `components/` 하위에 새 폴더 생성
3. **공통 컴포넌트**: `components/ui/`에 배치
4. **타입 정의**: `types/` 폴더에 추가
5. **API 관련**: `api/` 폴더에 추가

이 구조는 확장성과 유지보수성을 고려하여 설계되었습니다. 