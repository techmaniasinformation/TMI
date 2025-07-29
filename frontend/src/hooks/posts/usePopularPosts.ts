import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
  stars: number;
}

export const usePopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인기 게시글 가져오기
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        setLoading(true);
        // TODO: 실제 API로 변경 시 - /api/posts/popular?limit=10
        const response = await fetch('/articles.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular posts');
        }
        
        const data: Post[] = await response.json();
        
        // star 기준 상위 10개 추출 (실제로는 서버에서 처리)
        const popularData = data
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 10);
        
        setPopularPosts(popularData);
        setError(null);
      } catch (err) {
        console.error('Error loading popular posts:', err);
        setError('인기 게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return {
    popularPosts,
    loading,
    error,
    formatNumber
  };
}; 