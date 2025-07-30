import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildSearchApiParams } from '@/utils';
import { searchPostsFromJson } from '@/utils/api';
import { SearchApiResponse, Post, PageInfo, AppliedFilters } from '@/types';

interface SearchResults {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  setCurrentPage: (page: number) => void;
}

export const useSearchResults = (): SearchResults => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(null);
  
  // 이전 검색 조건을 저장하는 ref
  const prevSearchConditionsRef = useRef<string>('');

  // URL 파라미터에서 검색 조건 추출 (메모이제이션)
  const searchConditions = useMemo(() => {
    const keyword = searchParams.get('keyword') ?? '';
    const techTags = searchParams.get('techTags')?.split(',').filter(Boolean) ?? [];
    const companyTags = searchParams.get('companyTags')?.split(',').filter(Boolean) ?? [];
    const currentPage = parseInt(searchParams.get('page') ?? '1');
    
    return { keyword, techTags, companyTags, currentPage };
  }, [searchParams]);
  
  const { keyword, techTags, companyTags, currentPage } = searchConditions;
  
  // 검색 조건이 있는지 확인 (메모이제이션)
  const hasSearchConditions = useMemo(() => {
    return keyword || techTags.length > 0 || companyTags.length > 0;
  }, [keyword, techTags, companyTags]);

  // 페이지 변경 핸들러
  const setCurrentPage = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // 검색 실행
  useEffect(() => {
    // 현재 검색 조건을 문자열로 변환
    const currentSearchConditions = JSON.stringify({ keyword, techTags, companyTags, currentPage });
    
    // 이전 검색 조건과 동일하면 API 호출하지 않음
    if (prevSearchConditionsRef.current === currentSearchConditions) {
      return;
    }
    
    // 이전 검색 조건 업데이트
    prevSearchConditionsRef.current = currentSearchConditions;

    let isMounted = true;
    
    const searchPostsData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);

      try {
        // API 파라미터 구성
        const apiParams = buildSearchApiParams(
          keyword,
          techTags,
          companyTags,
          currentPage,
          10
        );

        console.log('🔍 Search API Request:', {
          url: '/api/v1/posts',
          params: apiParams,
          searchConditions: { keyword, techTags, companyTags, currentPage }
        });

        if (!isMounted) return;

        // JSON 파일에서 검색 결과 가져오기 - API 파라미터 사용
        const response: SearchApiResponse = await searchPostsFromJson(apiParams);

        if (!isMounted) return;

        const { posts, pageInfo, appliedFilters: responseFilters } = response.data;

        console.log('✅ Search API Response:', {
          totalElements: pageInfo.totalElements,
          totalPages: pageInfo.totalPages,
          currentPage: pageInfo.currPage,
          postsCount: posts.length,
          appliedFilters: responseFilters
        });

        console.log('🔄 상태 업데이트 전:', { posts: posts.length, totalCount: pageInfo.totalElements });

        setPosts(posts);
        setTotalCount(pageInfo.totalElements);
        setAppliedFilters(responseFilters || null);

        console.log('🔄 상태 업데이트 완료');

      } catch (err) {
        if (!isMounted) return;
        console.error('❌ Search error:', err);
        setError('검색 중 오류가 발생했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    searchPostsData();

    return () => {
      isMounted = false;
    };
  }, [keyword, techTags, companyTags, currentPage]); // hasSearchConditions 제거

  return {
    posts,
    loading,
    error,
    currentPage,
    totalCount,
    appliedFilters,
    setCurrentPage
  };
}; 