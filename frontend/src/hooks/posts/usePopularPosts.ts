import { useState, useEffect, useCallback, useMemo } from 'react';
import { Post, SearchApiResponse } from '@/types';

// 실제 API 호출 함수
const fetchPopularPostsFromAPI = async (): Promise<SearchApiResponse> => {
  try {
    const response = await fetch('https://i13a509.p.ssafy.io/api/v1/post?page=1&size=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('❌ [fetchPopularPostsFromAPI] API 호출 실패:', error);
    throw error;
  }
};

export const usePopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인기 게시글 가져오기 함수를 useCallback으로 메모이제이션
  const fetchPopularPosts = useCallback(async () => {
    try {
      console.log('🔍 [usePopularPosts] 인기 게시글 가져오기 시작');
      setLoading(true);
      
      // 실제 API에서 데이터 가져오기
      const response: SearchApiResponse = await fetchPopularPostsFromAPI();
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
  }, []);

  // 인기 게시글 가져오기
  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  // 숫자 포맷팅 함수를 useMemo로 메모이제이션
  const formatNumber = useMemo(() => {
    return (num: number): string => {
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
      }
      return num.toString();
    };
  }, []);

  return {
    popularPosts,
    loading,
    error,
    formatNumber
  };
}; 