import { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchApiResponse, Post, PageInfo } from '@/types';
import { useUserStore } from '@/stores/userStore';
import { useSearchParams } from 'react-router-dom';
import { formatUTCToKSTDate } from '@/utils/dateUtils';

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
    // 팔로우 API: /api/v1/post?followMemberId={:memberId}&page={:page}&size=10
    apiUrl = `https://i13a509.p.ssafy.io/api/v1/post?followMemberId=${followMemberId}&page=${page}&size=10`;
    console.log('🔍 팔로우 API 호출:', apiUrl);
  } else {
    // 최신글 API: /api/v1/post?page=1&size=10
    apiUrl = `https://i13a509.p.ssafy.io/api/v1/post?page=${page}&size=${size}`;
    console.log('🔍 최신글 API 호출:', apiUrl);
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
  
  // URL에서 직접 상태 계산 (단일 소스의 진실)
  const currentPage = parseInt(searchParams.get('page') || '1');
  const followMemberId = searchParams.get('followMemberId');
  const currentTab = followMemberId ? 'following' : 'latest';
  
  const [state, setState] = useState<PostsListState>({
    posts: [],
    loading: false,
    error: null,
    currentPage,
    totalPages: 0,
    totalElements: 0,
    isLast: false
  });

  const { user } = useUserStore();
  const isLoggedIn = user !== null && user.memberId > 0;

  // 단순화된 API 호출 함수
  const fetchPosts = useCallback(async () => {
    // 팔로우 탭이고 로그인하지 않았으면 API 호출하지 않음
    if (currentTab === 'following' && (!isLoggedIn || followMemberId === 'guest')) {
      console.log('🔍 팔로우 탭이지만 로그인하지 않음 - API 호출 안함');
      setState(prev => ({ ...prev, posts: [], loading: false, error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 실제 API에서 데이터 가져오기
      const response: SearchApiResponse = await fetchPostsFromAPI({ 
        page: currentPage, 
        size: 10, 
        followMemberId: currentTab === 'following' ? user?.memberId : undefined
      });
      
      const { posts: apiPosts, pageInfo } = response.data;

      // API 응답을 프론트엔드 타입으로 변환
      const transformedPosts = (apiPosts || []).map((post: any) => ({
        postId: post.postId,
        title: post.title,
        content: post.content || '',
        tags: post.tags || [],
        memberProfileUrl: post.memberProfile || '', // API: memberProfile -> Frontend: memberProfileUrl
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

      setState({
        posts: transformedPosts,
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
  }, [currentPage, currentTab, user?.memberId, isLoggedIn, followMemberId]);

  // 단순화된 useEffect - URL 변경 시에만 API 호출
  useEffect(() => {
    console.log('🔍 URL 변경 감지 - API 호출:', { currentPage, currentTab, isLoggedIn });
    fetchPosts();
  }, [fetchPosts]);

  // 단순화된 탭 변경 함수
  const setActiveTab = useCallback((tabId: 'latest' | 'following') => {
    console.log('🔍 탭 변경 시도:', tabId, '현재 탭:', currentTab);
    
    // 같은 탭을 클릭한 경우 페이지만 1로 초기화
    if (tabId === currentTab) {
      console.log('🔍 같은 탭 클릭 - 페이지를 1로 초기화');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', '1');
      setSearchParams(newSearchParams);
      return;
    }
    
    // 탭 변경 시 URL 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (tabId === 'following') {
      if (isLoggedIn) {
        console.log('🔍 팔로우 탭으로 변경 (로그인됨)');
        newSearchParams.set('followMemberId', user?.memberId?.toString() || '');
      } else {
        console.log('🔍 팔로우 탭으로 변경 (로그인 안됨) - UI에서 처리');
        // 비로그인 사용자도 URL을 변경하여 탭 상태를 업데이트
        newSearchParams.set('followMemberId', 'guest');
      }
    } else {
      console.log('🔍 최신 탭으로 변경');
      newSearchParams.delete('followMemberId');
    }
    
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  }, [currentTab, searchParams, setSearchParams, user?.memberId, isLoggedIn]);

  // 페이지 변경 함수
  const setCurrentPage = useCallback((page: number) => {
    if (page === currentPage) return;
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [currentPage, searchParams, setSearchParams]);

  // 날짜 포맷팅 함수
  const formatDate = useMemo(() => {
    return (date: string) => {
      return formatUTCToKSTDate(date);
    };
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = useMemo(() => {
    return (num: number) => {
      return num.toLocaleString('ko-KR');
    };
  }, []);

  return {
    ...state,
    currentPage,
    currentTab,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber,
    isLoggedIn
  };
}; 