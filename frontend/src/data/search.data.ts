import { Post } from '@/types/search.types';

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
  }
]; 