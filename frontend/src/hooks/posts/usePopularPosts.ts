import { useState, useEffect } from 'react';
import { SearchApiResponse, Post } from '@/types';

// 실제 API 호출 함수
const fetchPopularPostsFromAPI = async (): Promise<SearchApiResponse> => {
  console.log('🔍 [fetchPopularPostsFromAPI] 인기 게시글 API 호출 시작');
  
  const apiUrl = 'https://i13a509.p.ssafy.io/api/v1/post/popular';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: 실제 인증 토큰이 있다면 추가
        // 'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchApiResponse = await response.json();
    
    console.log('✅ [fetchPopularPostsFromAPI] 인기 게시글 API 호출 성공:', {
      postsCount: data.data.posts.length
    });

    return data;
  } catch (error) {
    console.error('❌ [fetchPopularPostsFromAPI] 인기 게시글 API 호출 실패:', error);
    throw error;
  }
};

export const usePopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인기 게시글 가져오기
  useEffect(() => {
    const fetchPopularPosts = async () => {
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