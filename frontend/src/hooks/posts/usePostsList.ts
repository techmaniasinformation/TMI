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
  
  // URL에서 페이지와 탭 상태 읽기 - API 형태로 변경
  const urlPage = parseInt(searchParams.get('page') || '1');
  const urlFollowMemberId = searchParams.get('followMemberId');
  const urlTab = urlFollowMemberId ? 'following' : 'latest';
  
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
  const { user } = useUserStore();
  const isLoggedIn = user !== null && user.memberId > 0;

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
  }, [user?.memberId]);

  // 초기 데이터 로드 및 URL 변경 감지
  useEffect(() => {
    const currentUrlPage = parseInt(searchParams.get('page') || '1');
    const currentUrlFollowMemberId = searchParams.get('followMemberId');
    const currentUrlTab = currentUrlFollowMemberId ? 'following' : 'latest';
    
    console.log('🔍 useEffect - URL 파라미터 감지:', {
      page: currentUrlPage,
      followMemberId: currentUrlFollowMemberId,
      tab: currentUrlTab,
      currentState: { page: state.currentPage, tab: activeTab }
    });
    
    // URL과 상태가 다르면 동기화
    if (currentUrlPage !== state.currentPage || currentUrlTab !== activeTab) {
      console.log('🔍 상태 동기화 필요');
      setState(prev => ({ ...prev, currentPage: currentUrlPage }));
      setActiveTab(currentUrlTab);
    }
    
    // 팔로우 탭이고 로그인하지 않았으면 API 호출하지 않음
    if (currentUrlTab === 'following' && !isLoggedIn) {
      console.log('🔍 팔로우 탭이지만 로그인하지 않음');
      setState(prev => ({ ...prev, posts: [], loading: false }));
      return;
    }
    
    // 데이터 로드 (초기 로드 또는 URL 변경 시)
    console.log('🔍 API 호출 시작:', currentUrlPage, currentUrlTab);
    fetchPosts(currentUrlPage, currentUrlTab);
  }, [searchParams, state.currentPage, activeTab, isLoggedIn, fetchPosts]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((newTab: 'latest' | 'following') => {
    console.log('🔍 탭 변경 시도:', newTab, '현재 탭:', activeTab);
    
    // 같은 탭을 클릭한 경우에도 페이지를 1로 초기화
    if (newTab === activeTab) {
      console.log('🔍 같은 탭 클릭 - 페이지를 1로 초기화');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', '1'); // 페이지를 1로 초기화
      newSearchParams.set('size', '10');
      console.log('🔍 같은 탭 클릭으로 인한 페이지 초기화:', newSearchParams.toString());
      setSearchParams(newSearchParams);
      return;
    }
    
    // 탭 변경 시 페이지를 1로 초기화
    console.log('🔍 탭 변경으로 인한 페이지 초기화: 1');
    
    // URL 업데이트 - API 형태로 변경
    const newSearchParams = new URLSearchParams(searchParams);
    if (newTab === 'following') {
      console.log('🔍 팔로우 탭으로 변경, 사용자 ID:', user?.memberId);
      newSearchParams.set('followMemberId', user?.memberId?.toString() || '');
      newSearchParams.set('page', '1'); // 페이지를 1로 초기화
      newSearchParams.set('size', '10');
      newSearchParams.delete('tab'); // 기존 tab 파라미터 제거
    } else {
      console.log('🔍 최신 탭으로 변경');
      newSearchParams.set('page', '1'); // 페이지를 1로 초기화
      newSearchParams.set('size', '10');
      newSearchParams.delete('followMemberId'); // 팔로우 파라미터 제거
      newSearchParams.delete('tab'); // 기존 tab 파라미터 제거
    }
    console.log('🔍 새로운 URL 파라미터:', newSearchParams.toString());
    setSearchParams(newSearchParams);
  }, [activeTab, searchParams, setSearchParams, user?.memberId]);

  // 페이지 변경 핸들러를 useCallback으로 메모이제이션
  const setCurrentPage = useCallback((page: number) => {
    if (page === state.currentPage) return;
    
    // URL 업데이트 - API 형태로 변경
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    newSearchParams.set('size', '10');
    setSearchParams(newSearchParams);
  }, [state.currentPage, searchParams, setSearchParams]);

  // 날짜 포맷팅 함수를 useMemo로 메모이제이션 (UTC -> KST 변환)
  const formatDate = useMemo(() => {
    return (date: string) => {
      return formatUTCToKSTDate(date);
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
    setActiveTab: (tabId: string) => {
      console.log('🔍 setActiveTab 호출됨:', tabId);
      handleTabChange(tabId as 'latest' | 'following');
    },
    setCurrentPage,
    formatDate,
    formatNumber,
    isLoggedIn
  };
}; 