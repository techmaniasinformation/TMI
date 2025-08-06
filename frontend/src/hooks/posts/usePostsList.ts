import { useState, useEffect } from 'react';
import { SearchApiResponse, Post, PageInfo } from '@/types';

interface PostsListState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLast: boolean;
}

// 실제 API 호출 함수
const fetchPostsFromAPI = async (params: { page: number; size: number; sort: string }): Promise<SearchApiResponse> => {
  console.log('🔍 [fetchPostsFromAPI] API 호출 시작:', params);
  
  const { page, size } = params;
  const apiUrl = `https://i13a509.p.ssafy.io/api/v1/post?page=${page}&size=${size}`;
  
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
    
    console.log('✅ [fetchPostsFromAPI] API 호출 성공:', {
      totalElements: data.data.pageInfo?.totalElements ?? 0,
      totalPages: data.data.pageInfo?.totalPages ?? 1,
      currentPage: data.data.pageInfo?.currPage ?? 1,
      postsCount: data.data.posts.length
    });

    return data;
  } catch (error) {
    console.error('❌ [fetchPostsFromAPI] API 호출 실패:', error);
    throw error;
  }
};

export const usePostsList = () => {
  const [state, setState] = useState<PostsListState>({
    posts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    isLast: false
  });

  const [activeTab, setActiveTab] = useState<'latest' | 'following'>('latest');

  // 게시글 목록 가져오기
  const fetchPosts = async (page: number = 1, sort: 'latest' | 'following' = 'latest') => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 [usePostsList] 게시글 목록 가져오기 시작:', { page, sort });
      
      // 실제 API에서 데이터 가져오기
      const response: SearchApiResponse = await fetchPostsFromAPI({ 
        page, 
        size: 10, 
        sort 
      });
      
      const { posts, pageInfo } = response.data;

      console.log('✅ [usePostsList] 게시글 목록 가져오기 완료:', {
        totalElements: pageInfo?.totalElements ?? 0,
        totalPages: pageInfo?.totalPages ?? 1,
        currentPage: pageInfo?.currPage ?? 1,
        postsCount: posts.length
      });

      setState({
        posts,
        loading: false,
        error: null,
        currentPage: pageInfo?.currPage ?? 1,
        totalPages: pageInfo?.totalPages ?? 1,
        totalElements: pageInfo?.totalElements ?? 0,
        isLast: pageInfo?.isLast ?? false
      });

    } catch (error) {
      console.error('❌ Posts fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '게시글을 불러오는 중 오류가 발생했습니다.'
      }));
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchPosts(1, activeTab);
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 탭 변경 시 게시글 다시 가져오기
  useEffect(() => {
    // 초기 로드가 아닌 경우에만 탭 변경 시 API 호출
    if (state.posts.length > 0) {
      fetchPosts(1, activeTab);
    }
  }, [activeTab]);

  // 페이지 변경 핸들러
  const setCurrentPage = (page: number) => {
    fetchPosts(page, activeTab);
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR');
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return {
    ...state,
    activeTab,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber
  };
}; 