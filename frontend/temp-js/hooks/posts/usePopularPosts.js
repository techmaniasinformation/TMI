import { useState, useEffect } from 'react';
// 인기게시글 API 호출 함수
const fetchPopularPosts = async (size = 3) => {
  try {
    const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/popular?size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // API 응답을 프론트엔드 타입으로 변환
    const transformedPosts = (data.data?.posts || []).map(post => ({
      postId: post.postId,
      title: post.title,
      content: post.content || '',
      tags: post.tags || [],
      memberProfileUrl: post.memberProfile || '',
      // API: memberProfile -> Frontend: memberProfileUrl
      companyProfileUrl: post.companyProfileUrl || undefined,
      name: post.name,
      badgeUrl: post.badgeUrl || '',
      createAt: post.createAt,
      viewCount: post.viewCount,
      starCount: post.starCount,
      commentCount: post.commentCount,
      thumbnailUrl: post.thumbnailUrl || '',
      link: post.link || '',
      isStar: post.isStar || false
    }));
    return transformedPosts;
  } catch (error) {
    console.error('❌ [fetchPopularPosts] API 호출 실패:', error);
    throw error;
  }
};
export const usePopularPosts = (size = 3) => {
  const [state, setState] = useState({
    posts: [],
    loading: false,
    error: null
  });
  useEffect(() => {
    const loadPopularPosts = async () => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
      try {
        const posts = await fetchPopularPosts(size);
        setState({
          posts,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('❌ Popular posts fetch error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: '인기게시글을 불러오는 중 오류가 발생했습니다.'
        }));
      }
    };
    loadPopularPosts();
  }, [size]);

  // 숫자 포맷팅 함수
  const formatNumber = num => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };
  return {
    ...state,
    formatNumber
  };
};