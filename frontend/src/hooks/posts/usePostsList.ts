import { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchApiResponse, Post, PageInfo } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { useSearchParams } from 'react-router-dom';

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
const fetchPostsFromAPI = async (params: { page: number; size: number; followMemberId?: number }): Promise<SearchApiResponse> => {
  
  const { page, size, followMemberId } = params;
  
  // 팔로우 API와 최신글 API를 명확히 구분
  let apiUrl: string;
  if (followMemberId) {
    // 팔로우 API: /api/v1/post?followMemberId=101&page=1&size=10
    apiUrl = `https://i13a509.p.ssafy.io/api/v1/post?followMemberId=${followMemberId}&page=${page}&size=${size}`;
  } else {
    // 최신글 API: /api/v1/post?page=1&size=10
    apiUrl = `https://i13a509.p.ssafy.io/api/v1/post?page=${page}&size=${size}`;
  }
  
  try {
    const response = await fetch(apiUrl, {
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
    console.error('❌ [fetchPostsFromAPI] API 호출 실패:', error);
    throw error;
  }
};

export const usePostsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 페이지와 탭 상태 읽기
  const urlPage = parseInt(searchParams.get('page') || '1');
  const urlTab = searchParams.get('tab') as 'latest' | 'following' || 'latest';
  
  const [state, setState] = useState<PostsListState>({
    posts: [],
    loading: false,
    error: null,
    currentPage: urlPage,
    totalPages: 0,
    totalElements: 0,
    isLast: false
  });

  const [activeTab, setActiveTab] = useState<'latest' | 'following'>(urlTab);
  
  // 로그인 상태 확인
  const { isLogin, user } = useUserStore();
  const isLoggedIn = isLogin;

  // 게시글 목록 가져오기 함수를 useCallback으로 메모이제이션
  const fetchPosts = useCallback(async (page: number = 1, sort: 'latest' | 'following' = 'latest') => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 실제 API에서 데이터 가져오기
      const response: SearchApiResponse = await fetchPostsFromAPI({ 
        page, 
        size: 10, 
        followMemberId: sort === 'following' ? user?.memberId : undefined
      });
      
      const { posts, pageInfo } = response.data;

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
  }, [user?.memberId]);

  // URL 변경 감지하여 상태 동기화
  useEffect(() => {
    const currentUrlPage = parseInt(searchParams.get('page') || '1');
    const currentUrlTab = searchParams.get('tab') as 'latest' | 'following' || 'latest';
    
    // URL과 상태가 다르면 동기화
    if (currentUrlPage !== state.currentPage || currentUrlTab !== activeTab) {
      setState(prev => ({ ...prev, currentPage: currentUrlPage }));
      setActiveTab(currentUrlTab);
    }
  }, [searchParams, state.currentPage, activeTab]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // 팔로우 탭이고 로그인하지 않았으면 API 호출하지 않음
    if (activeTab === 'following' && !isLoggedIn) {
      return;
    }
    fetchPosts(state.currentPage, activeTab);
  }, [fetchPosts, activeTab, isLoggedIn, state.currentPage]); // 의존성 배열 수정

  // 탭 변경 시 게시글 다시 가져오기
  useEffect(() => {
    // URL 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', activeTab);
    newSearchParams.set('page', '1'); // 탭 변경 시 페이지 1로 리셋
    setSearchParams(newSearchParams);
    
    // 팔로우 탭이고 로그인하지 않았으면 게시글 초기화
    if (activeTab === 'following' && !isLoggedIn) {
      setState(prev => ({ ...prev, posts: [], loading: false }));
      return;
    }
    fetchPosts(1, activeTab);
  }, [activeTab, isLoggedIn, fetchPosts, searchParams, setSearchParams]);

  // 페이지 변경 핸들러를 useCallback으로 메모이제이션
  const setCurrentPage = useCallback((page: number) => {
    // URL 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
    
    fetchPosts(page, activeTab);
  }, [fetchPosts, activeTab, searchParams, setSearchParams]);

  // 날짜 포맷팅 함수를 useMemo로 메모이제이션
  const formatDate = useMemo(() => {
    return (date: string) => {
      return new Date(date).toLocaleDateString('ko-KR');
    };
  }, []);

  // 숫자 포맷팅 함수를 useMemo로 메모이제이션
  const formatNumber = useMemo(() => {
    return (num: number) => {
      return num.toLocaleString('ko-KR');
    };
  }, []);

  return {
    ...state,
    activeTab,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber,
    isLoggedIn
  };
}; 