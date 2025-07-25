import { Post } from './types';

export const mockPosts: Post[] = [
  {
    id: 1,
    title: 'React 18의 새로운 기능과 개발 트렌드 분석',
    author: {
      name: '김개발',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20korean%20software%20developer%20portrait%20with%20clean%20modern%20office%20background%20wearing%20casual%20business%20attire%20with%20friendly%20smile%20and%20confident%20expression&width=40&height=40&seq=avatar1&orientation=squarish',
      company: '네이버'
    },
    tags: ['React', '프론트엔드', 'JavaScript', '웹개발'],
    content: 'React 18에서 도입된 Concurrent Features와 Suspense의 개선사항에 대해 자세히 알아보겠습니다.',
    createdAt: '2024-01-15',
    views: 1250,
    likes: 89
  }
]; 