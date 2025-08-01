# 🏗️ 컴포넌트 아키텍처 가이드

## 📋 4단계 컴포넌트 분류 체계

### 🏗️ **1단계: Foundation Components**
**정의**: 애플리케이션의 가장 기본적인 UI 빌딩 블록이자 재사용성이 가장 높은, 순수한 UI 요소  
**위치**: `src/components/ui/`  
**특징**: 특정 비즈니스 로직이나 도메인에 종속되지 않고, 어디서든 독립적으로 사용 가능

**예시 컴포넌트:**
- Button, Input, Checkbox, Radio, Dropdown
- Modal, Tooltip, Avatar, Badge, Card  
- Loading (Spinner), Typography, Spacer

**사용 예시:**
```typescript
import { Button, Input, Modal } from '@/components/ui';

// 어디서든 독립적으로 사용 가능
<Button variant="primary" onClick={handleClick}>
  클릭하세요
</Button>
```

---

### 🔗 **2단계: Shared Domain-Agnostic Components**
**정의**: 특정 도메인에 종속되지 않으면서도, 두 개 이상의 다른 도메인에서 재사용될 수 있는 복합적인 컴포넌트  
**위치**: `src/components/common/`  
**특징**: 여러 Foundation Components를 조합하거나, 범용적인 로직을 포함하지만 특정 기능의 핵심 로직과는 분리

**예시 컴포넌트:**
- SearchBar (검색 기능이 여러 페이지/도메인에서 사용)
- Pagination (게시물 목록, 댓글 목록 등에서 사용)
- ImageUploadField (사진 업로드 기능)
- ToastNotification (전역 알림)
- AlertDialog (범용 확인/경고 팝업)
- ErrorBoundary, ProtectedRoute (횡단 관심사 처리)

**사용 예시:**
```typescript
import { SearchBar, Pagination } from '@/components/common';

// 게시글 페이지에서
<SearchBar onSearch={handlePostSearch} />

// 사용자 페이지에서
<SearchBar onSearch={handleUserSearch} />

// 두 곳 모두에서 재사용 가능
<Pagination 
  currentPage={page} 
  totalPages={totalPages} 
  onPageChange={handlePageChange} 
/>
```

---

### 🎯 **3단계: Domain Components**
**정의**: 특정 비즈니스 도메인과 강하게 연관되어 해당 도메인 내에서만 주로 사용되는 컴포넌트  
**위치**: `src/features/[domain-name]/components/`  
**특징**: Foundation과 Shared Components를 조합하여 특정 기능의 UI를 구성하며, 해당 도메인의 데이터나 로직을 포함

**예시 컴포넌트:**
- `features/auth/components/`: LoginForm, SignupForm, AuthModal
- `features/posts/components/`: PostCard, PostList, PostDetail, PostEditor
- `features/user/components/`: ProfileCard, ProfileEditForm, UserStats
- `features/search/components/`: SearchResultsList, SearchFilters
- `features/notifications/components/`: NotificationItem, NotificationList

**사용 예시:**
```typescript
import { PostCard } from '@/features/posts/components';
import { Button } from '@/components/ui';
import { SearchBar } from '@/components/common';

// PostCard는 posts 도메인에서만 사용
// 내부적으로 Foundation과 Shared Components를 조합
function PostList() {
  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
```

---

### 🔧 **4단계: Local Components (Internal Components)**
**정의**: 특정 도메인 컴포넌트 내부에서만 사용되고, 외부로 노출되거나 재사용될 필요가 거의 없는 가장 작은 단위의 컴포넌트  
**위치**: `src/features/[domain-name]/components/[ParentComponent]/internal/`  
**특징**: 오직 부모 컴포넌트의 가독성을 높이거나 복잡한 부분을 분리하기 위해 생성

**예시 구조:**
```
features/posts/components/PostEditor/
├── PostEditor.tsx           # 메인 컴포넌트
├── PostEditor.test.tsx      # 테스트 파일
├── index.ts                 # export default PostEditor
└── internal/                # 내부 전용 컴포넌트들
    ├── ImageUploadButton.tsx
    ├── TagInput.tsx
    ├── ToolbarButton.tsx
    └── PreviewPanel.tsx
```

**사용 예시:**
```typescript
// PostEditor.tsx 내부에서만 사용
import { ImageUploadButton } from './internal/ImageUploadButton';
import { TagInput } from './internal/TagInput';
import { Button } from '@/components/ui';

function PostEditor() {
  return (
    <div>
      <TagInput onTagsChange={handleTagsChange} />
      <ImageUploadButton onImageUpload={handleImageUpload} />
      <Button onClick={handleSave}>저장</Button>
    </div>
  );
}

// internal 컴포넌트들은 외부로 export하지 않음
// 오직 PostEditor 내부에서만 import하여 사용
```

---

## 📐 컴포넌트 선택 가이드

### **언제 어떤 단계의 컴포넌트를 만들어야 할까?**

#### 🏗️ **Foundation Component를 만들어야 할 때:**
- 디자인 시스템의 기본 요소가 필요할 때
- 프로젝트 전체에서 일관된 UI가 필요할 때
- 특정 도메인에 종속되지 않는 순수한 UI 요소가 필요할 때

#### 🔗 **Shared Component를 만들어야 할 때:**
- 2개 이상의 도메인에서 동일한 기능이 필요할 때
- Foundation Components를 조합한 복합 기능이 여러 곳에서 사용될 때
- 횡단 관심사(에러 처리, 인증 등)를 처리해야 할 때

#### 🎯 **Domain Component를 만들어야 할 때:**
- 특정 비즈니스 로직이 강하게 연관된 UI가 필요할 때
- 해당 도메인의 데이터 구조와 밀접한 관련이 있을 때
- 다른 도메인에서는 사용되지 않을 것 같은 특화된 기능일 때

#### 🔧 **Local Component를 만들어야 할 때:**
- 부모 컴포넌트가 너무 복잡해져서 가독성이 떨어질 때
- 특정 부분을 분리하고 싶지만 재사용할 필요는 없을 때
- 테스트나 유지보수를 위해 작은 단위로 분리하고 싶을 때

---

## 🚫 **주의사항 및 모범 사례**

### ❌ **하지 말아야 할 것:**
1. **잘못된 의존성 방향**: 상위 단계가 하위 단계를 의존하는 것은 금지
   - ❌ Foundation Component가 Domain Component를 import
   - ❌ Shared Component가 Domain Component를 import

2. **과도한 추상화**: 재사용되지 않을 컴포넌트를 Foundation/Shared로 분리
3. **internal 컴포넌트 외부 노출**: internal 폴더의 컴포넌트를 외부에서 import

### ✅ **올바른 의존성 방향:**
```
Pages → Domain Components → Shared Components → Foundation Components
  ↓           ↓                    ↓                    ↓
Local      (Domain 내부)    (여러 Domain에서)      (전체에서)
Components    사용              재사용            재사용
```

### 📁 **파일 구조 규칙:**
```typescript
// 각 컴포넌트 폴더 구조
ComponentName/
├── ComponentName.tsx        # 메인 컴포넌트
├── ComponentName.test.tsx   # 테스트 파일
├── ComponentName.stories.tsx # 스토리북 (선택)
├── index.ts                 # export default ComponentName
└── internal/                # 내부 컴포넌트들 (필요시)
    ├── SubComponent.tsx
    └── AnotherSubComponent.tsx
```

### 🔄 **Import 규칙:**
```typescript
// ✅ 올바른 import 방향
import { Button } from '@/components/ui';           // Foundation
import { SearchBar } from '@/components/common';    // Shared  
import { PostCard } from '@/features/posts/components'; // Domain

// ❌ 잘못된 import 방향
import { PostCard } from '@/features/posts/components'; 
// Foundation Component에서 Domain Component import (금지)
```

이 가이드를 따르면 유지보수하기 쉽고 확장 가능한 컴포넌트 구조를 만들 수 있습니다! 🚀