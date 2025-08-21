import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { formatUTCToKSTDate } from '@/utils/dateUtils';

// 게시글 목록 UI 액션 훅
export const usePostsListUI = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUserStore();
  
  // URL에서 직접 상태 계산 (단일 소스의 진실)
  const currentPage = parseInt(searchParams.get('page') || '1');
  const followMemberId = searchParams.get('followMemberId');
  const currentTab = followMemberId ? 'following' : 'latest';
  const isLoggedIn = user !== null && user.memberId > 0;

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
    currentPage,
    currentTab,
    followMemberId,
    isLoggedIn,
    setActiveTab,
    setCurrentPage,
    formatDate,
    formatNumber,
  };
};
