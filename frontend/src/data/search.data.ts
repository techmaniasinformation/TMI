import { Post } from '@/types';

export const mockPosts = [
  {
    id: 1,
    title: "React 18의 새로운 기능들과 개발 팁 완벽 가이드",
    author: {
      name: "테크코리아",
      avatar: "https://readdy.ai/api/search-image?query=professional%20tech%20company%20logo%20with%20modern%20design%20clean%20background%20corporate%20style&width=40&height=40&seq=profile1&orientation=squarish",
      company: "네이버"
    },
    tags: ["React", "JavaScript", "프론트엔드", "개발팁", "웹개발"],
    content: "React 18의 새로운 기능들과 개발 팁에 대한 완벽한 가이드입니다. Concurrent Features, Suspense, 그리고 새로운 훅들에 대해 자세히 알아보세요.",
    createdAt: "2024-01-15",
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: "TypeScript로 안전한 웹 개발하기",
    author: {
      name: "개발자김",
      avatar: "https://readdy.ai/api/search-image?query=developer%20profile%20avatar&width=40&height=40&seq=profile2&orientation=squarish",
      company: "카카오"
    },
    tags: ["TypeScript", "JavaScript", "개발팁"],
    content: "TypeScript를 사용하여 더 안전하고 유지보수하기 쉬운 웹 애플리케이션을 개발하는 방법을 알아보세요.",
    createdAt: "2024-01-14",
    views: 890,
    likes: 67
  },
  {
    id: 3,
    title: "Python으로 데이터 분석 시작하기",
    author: {
      name: "데이터사이언티스트",
      avatar: "https://readdy.ai/api/search-image?query=data%20scientist%20profile&width=40&height=40&seq=profile3&orientation=squarish",
      company: "삼성전자"
    },
    tags: ["Python", "데이터분석", "pandas", "numpy", "머신러닝"],
    content: "Python을 사용한 데이터 분석의 기초부터 고급 기법까지 단계별로 학습해보세요.",
    createdAt: "2024-01-13",
    views: 2100,
    likes: 156
  },
  {
    id: 4,
    title: "Spring Boot로 REST API 개발하기",
    author: {
      name: "백엔드개발자",
      avatar: "https://readdy.ai/api/search-image?query=backend%20developer%20profile&width=40&height=40&seq=profile4&orientation=squarish",
      company: "LG전자"
    },
    tags: ["Spring", "Java", "REST API", "백엔드", "개발팁"],
    content: "Spring Boot를 사용하여 효율적이고 확장 가능한 REST API를 개발하는 방법을 알아보세요.",
    createdAt: "2024-01-12",
    views: 980,
    likes: 72
  },
  {
    id: 5,
    title: "Vue.js 3 Composition API 완벽 가이드",
    author: {
      name: "Vue마스터",
      avatar: "https://readdy.ai/api/search-image?query=vue%20developer%20profile&width=40&height=40&seq=profile5&orientation=squarish",
      company: "쿠팡"
    },
    tags: ["Vue.js", "JavaScript", "프론트엔드", "Composition API"],
    content: "Vue.js 3의 Composition API를 활용하여 더 나은 컴포넌트 구조를 만들어보세요.",
    createdAt: "2024-01-11",
    views: 750,
    likes: 45
  },
  {
    id: 6,
    title: "Docker와 Kubernetes로 컨테이너 오케스트레이션",
    author: {
      name: "DevOps엔지니어",
      avatar: "https://readdy.ai/api/search-image?query=devops%20engineer%20profile&width=40&height=40&seq=profile6&orientation=squarish",
      company: "토스"
    },
    tags: ["Docker", "Kubernetes", "DevOps", "컨테이너", "클라우드"],
    content: "Docker와 Kubernetes를 사용하여 효율적인 컨테이너 관리와 배포를 구현해보세요.",
    createdAt: "2024-01-10",
    views: 1650,
    likes: 123
  },
  {
    id: 7,
    title: "Node.js로 서버리스 아키텍처 구축하기",
    author: {
      name: "클라우드아키텍트",
      avatar: "https://readdy.ai/api/search-image?query=cloud%20architect%20profile&width=40&height=40&seq=profile7&orientation=squarish",
      company: "AWS"
    },
    tags: ["Node.js", "서버리스", "AWS Lambda", "클라우드", "마이크로서비스"],
    content: "Node.js와 AWS Lambda를 활용하여 서버리스 아키텍처를 구축하는 방법을 알아보세요.",
    createdAt: "2024-01-09",
    views: 890,
    likes: 67
  },
  {
    id: 8,
    title: "Flutter로 크로스 플랫폼 앱 개발하기",
    author: {
      name: "모바일개발자",
      avatar: "https://readdy.ai/api/search-image?query=mobile%20developer%20profile&width=40&height=40&seq=profile8&orientation=squarish",
      company: "구글"
    },
    tags: ["Flutter", "Dart", "모바일앱", "크로스플랫폼", "UI/UX"],
    content: "Flutter를 사용하여 iOS와 Android에서 동시에 실행되는 앱을 개발해보세요.",
    createdAt: "2024-01-08",
    views: 1200,
    likes: 89
  },
  {
    id: 9,
    title: "GraphQL로 효율적인 API 설계하기",
    author: {
      name: "API전문가",
      avatar: "https://readdy.ai/api/search-image?query=api%20expert%20profile&width=40&height=40&seq=profile9&orientation=squarish",
      company: "페이스북"
    },
    tags: ["GraphQL", "API", "백엔드", "데이터베이스", "개발팁"],
    content: "GraphQL을 사용하여 효율적이고 유연한 API를 설계하는 방법을 알아보세요.",
    createdAt: "2024-01-07",
    views: 680,
    likes: 52
  },
  {
    id: 10,
    title: "머신러닝 모델 배포를 위한 MLOps 실전",
    author: {
      name: "ML엔지니어",
      avatar: "https://readdy.ai/api/search-image?query=ml%20engineer%20profile&width=40&height=40&seq=profile10&orientation=squarish",
      company: "테슬라"
    },
    tags: ["머신러닝", "MLOps", "Python", "Docker", "클라우드"],
    content: "머신러닝 모델을 실제 서비스에 배포하기 위한 MLOps 파이프라인을 구축해보세요.",
    createdAt: "2024-01-06",
    views: 1450,
    likes: 108
  },
  {
    id: 11,
    title: "Redis로 고성능 캐싱 시스템 구축하기",
    author: {
      name: "인프라엔지니어",
      avatar: "https://readdy.ai/api/search-image?query=infrastructure%20engineer%20profile&width=40&height=40&seq=profile11&orientation=squarish",
      company: "넷플릭스"
    },
    tags: ["Redis", "캐싱", "성능최적화", "백엔드", "데이터베이스"],
    content: "Redis를 사용하여 고성능 캐싱 시스템을 구축하고 애플리케이션 성능을 향상시켜보세요.",
    createdAt: "2024-01-05",
    views: 920,
    likes: 74
  },
  {
    id: 12,
    title: "Next.js 13 App Router로 풀스택 개발하기",
    author: {
      name: "풀스택개발자",
      avatar: "https://readdy.ai/api/search-image?query=fullstack%20developer%20profile&width=40&height=40&seq=profile12&orientation=squarish",
      company: "마이크로소프트"
    },
    tags: ["Next.js", "React", "풀스택", "서버사이드렌더링", "웹개발"],
    content: "Next.js 13의 App Router를 사용하여 현대적인 풀스택 웹 애플리케이션을 개발해보세요.",
    createdAt: "2024-01-04",
    views: 1100,
    likes: 82
  },
  // React 관련 게시글 추가
  {
    id: 13,
    title: "React Hooks 완벽 마스터하기",
    author: {
      name: "React전문가",
      avatar: "https://readdy.ai/api/search-image?query=react%20expert%20profile&width=40&height=40&seq=profile13&orientation=squarish",
      company: "메타"
    },
    tags: ["React", "Hooks", "JavaScript", "프론트엔드", "개발팁"],
    content: "React Hooks의 모든 기능을 완벽하게 마스터하고 실전에서 활용하는 방법을 알아보세요.",
    createdAt: "2024-01-03",
    views: 1800,
    likes: 145
  },
  {
    id: 14,
    title: "React Context API로 상태 관리하기",
    author: {
      name: "상태관리전문가",
      avatar: "https://readdy.ai/api/search-image?query=state%20management%20expert&width=40&height=40&seq=profile14&orientation=squarish",
      company: "스포티파이"
    },
    tags: ["React", "Context API", "상태관리", "JavaScript", "개발팁"],
    content: "React Context API를 사용하여 효율적인 상태 관리를 구현하는 방법을 알아보세요.",
    createdAt: "2024-01-02",
    views: 950,
    likes: 78
  },
  {
    id: 15,
    title: "React Performance 최적화 기법",
    author: {
      name: "성능최적화전문가",
      avatar: "https://readdy.ai/api/search-image?query=performance%20optimization%20expert&width=40&height=40&seq=profile15&orientation=squarish",
      company: "구글"
    },
    tags: ["React", "성능최적화", "JavaScript", "프론트엔드", "개발팁"],
    content: "React 애플리케이션의 성능을 최적화하는 다양한 기법들을 실전 예제와 함께 학습해보세요.",
    createdAt: "2024-01-01",
    views: 2200,
    likes: 189
  }
]; 