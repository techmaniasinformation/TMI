import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, AppliedFilters, SearchApiResponse } from '@/types';

// JSON 파일들을 직접 import
import search1Condition from '../../../public/search-1-condition.json';
import search2Conditions from '../../../public/search-2-conditions.json';
import search3Conditions from '../../../public/search-3-conditions.json';
import searchNoResults from '../../../public/search-no-results.json';

interface SearchResults {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  setCurrentPage: (page: number) => void;
}

// JSON 데이터를 가져오는 함수
const getSearchData = (keyword: string, techTags: string[], companyTags: string[]): SearchApiResponse => {
  // 검색 조건 개수 계산
  const conditionCount = [keyword, techTags.length > 0, companyTags.length > 0].filter(Boolean).length;
  
  console.log('🔍 [getSearchData] 검색 조건 개수:', conditionCount);
  console.log('🔍 [getSearchData] 검색 조건:', { keyword, techTags, companyTags });
  
  // 조건 개수에 따라 해당 JSON 데이터 반환
  if (conditionCount === 0) {
    console.log('🔍 [getSearchData] 검색 조건 없음 - 빈 결과 반환');
    return searchNoResults as unknown as SearchApiResponse;
  } else if (conditionCount === 1) {
    console.log('🔍 [getSearchData] 검색 조건 1개 - 1개 조건 결과 반환');
    return search1Condition as unknown as SearchApiResponse;
  } else if (conditionCount === 2) {
    console.log('🔍 [getSearchData] 검색 조건 2개 - 2개 조건 결과 반환');
    return search2Conditions as unknown as SearchApiResponse;
  } else if (conditionCount >= 3) {
    console.log('🔍 [getSearchData] 검색 조건 3개 이상 - 3개 조건 결과 반환');
    return search3Conditions as unknown as SearchApiResponse;
  }
  
  // 기본값
  return searchNoResults as unknown as SearchApiResponse;
};

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

  // 페이지 변경 핸들러
  const setCurrentPage = useCallback((page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // 검색 실행
  useEffect(() => {
    // 검색 조건이 있는지 확인
    const hasSearchConditions = keyword || techTags.length > 0 || companyTags.length > 0;
    
    console.log('🔍 [useSearchResults] useEffect 실행:', {
      keyword,
      techTags,
      companyTags,
      currentPage,
      hasSearchConditions,
      loading: loading
    });
    
    // 검색 조건이 없으면 로딩 상태를 false로 설정하고 종료
    if (!hasSearchConditions) {
      console.log('🔍 [useSearchResults] 검색 조건 없음 - 상태 초기화');
      setLoading(false);
      setError(null);
      setPosts([]);
      setTotalCount(0);
      setAppliedFilters(null);
      return;
    }

    // 현재 검색 조건을 문자열로 변환
    const currentSearchConditions = JSON.stringify({ keyword, techTags, companyTags, currentPage });
    
    // 이전 검색 조건과 동일하면 API 호출하지 않음
    if (prevSearchConditionsRef.current === currentSearchConditions) {
      console.log('🔍 [useSearchResults] 이전 검색 조건과 동일 - API 호출 건너뜀');
      return;
    }
    
    // 이전 검색 조건 업데이트
    prevSearchConditionsRef.current = currentSearchConditions;

    let isMounted = true;
    
    const searchPostsData = () => {
      if (!isMounted) return;
      
      console.log('🔍 [useSearchResults] 검색 시작 - 로딩 상태 true로 설정');
      setLoading(true);
      setError(null);

      try {
        // JSON 데이터 가져오기 (동기적)
        const response = getSearchData(keyword, techTags, companyTags);

        if (!isMounted) {
          console.log('🔍 [useSearchResults] 컴포넌트 언마운트됨 - 상태 업데이트 중단');
          return;
        }

        const { posts, pageInfo, appliedFilters: responseFilters } = response.data;

        console.log('✅ [useSearchResults] 검색 완료:', {
          totalElements: pageInfo.totalElements,
          totalPages: pageInfo.totalPages,
          currentPage: pageInfo.currPage,
          postsCount: posts.length,
          appliedFilters: responseFilters
        });

        console.log('🔍 [useSearchResults] setPosts 호출');
        setPosts(posts);
        
        console.log('🔍 [useSearchResults] setTotalCount 호출');
        setTotalCount(pageInfo.totalElements);
        
        console.log('🔍 [useSearchResults] setAppliedFilters 호출');
        setAppliedFilters(responseFilters || null);

        console.log('🔄 상태 업데이트 완료');

      } catch (err) {
        if (!isMounted) {
          console.log('🔍 [useSearchResults] 컴포넌트 언마운트됨 - 에러 처리 중단');
          return;
        }
        console.error('❌ Search error:', err);
        setError('검색 중 오류가 발생했습니다.');
      } finally {
        if (isMounted) {
          console.log('🔍 [useSearchResults] 검색 완료 - 로딩 상태 false로 설정');
          setLoading(false);
        } else {
          console.log('🔍 [useSearchResults] 컴포넌트 언마운트됨 - 로딩 상태 업데이트 중단');
        }
      }
    };

    searchPostsData();

    return () => {
      isMounted = false;
    };
  }, [keyword, techTags, companyTags, currentPage]);

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