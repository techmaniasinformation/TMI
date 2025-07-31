import { useState, useEffect } from 'react';
import { Post } from '@/types';

// JSON 파일을 직접 import
import popularPostsData from '../../../public/popular-posts.json';

export const usePopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인기 게시글 가져오기
  useEffect(() => {
    const fetchPopularPosts = () => {
      try {
        console.log('🔍 [usePopularPosts] 인기 게시글 가져오기 시작');
        setLoading(true);
        
        // JSON 파일에서 데이터 가져오기
        const response = popularPostsData as any;
        const posts = response.data.posts;
        
        console.log('✅ [usePopularPosts] 인기 게시글 가져오기 완료:', {
          postsCount: posts.length
        });
        
        setPopularPosts(posts);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading popular posts:', err);
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