import { useState, useEffect } from 'react';
import { getPostsFromJson } from '@/utils/api';
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
      // JSON 파일에서 데이터 가져오기
      const response: SearchApiResponse = await getPostsFromJson({ 
        page, 
        size: 10, 
        sort 
      });
      
      const { posts, pageInfo } = response.data;

      setState({
        posts,
        loading: false,
        error: null,
        currentPage: pageInfo.currPage,
        totalPages: pageInfo.totalPages,
        totalElements: pageInfo.totalElements,
        isLast: pageInfo.isLast
      });

    } catch (error) {
      console.error('Posts fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '게시글을 불러오는 중 오류가 발생했습니다.'
      }));
    }
  };

  // 탭 변경 시 게시글 다시 가져오기
  useEffect(() => {
    fetchPosts(1, activeTab);
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