import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { extractSearchConditions, hasSearchConditions } from '@/utils/searchUtils';
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 검색 상태 타입 정의

// API에서 검색 데이터를 가져오는 함수
const fetchSearchData = async (keyword, techTagIds, companyTagIds, page, size = 10, abortController) => {
  const params = new URLSearchParams();
  if (keyword.trim()) {
    params.append('q', keyword.trim());
  }
  if (techTagIds.length > 0) {
    params.append('techTags', techTagIds.join(','));
  }
  if (companyTagIds.length > 0) {
    params.append('companyTags', companyTagIds.join(','));
  }
  params.append('page', page.toString());
  params.append('size', size.toString());
  const url = `${API_BASE_URL}/post/search?${params.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    signal: abortController?.signal
  });
  if (!response.ok) {
    throw new Error(`검색 중 오류가 발생했습니다. (${response.status})`);
  }
  return await response.json();
};

// 백엔드 응답을 프론트엔드 타입으로 변환하는 함수
const transformApiPostToPost = apiPost => {
  return {
    postId: apiPost.postId,
    title: apiPost.title,
    content: '',
    tags: apiPost.tags,
    memberProfileUrl: apiPost.memberProfile || '',
    // API: memberProfile -> Frontend: memberProfileUrl
    companyProfileUrl: apiPost.companyProfileUrl || undefined,
    name: apiPost.name,
    badgeUrl: apiPost.badgeUrl || '',
    createAt: apiPost.createAt,
    viewCount: apiPost.viewCount,
    starCount: apiPost.starCount,
    commentCount: apiPost.commentCount,
    thumbnailUrl: apiPost.thumbnailUrl,
    link: '',
    isStar: false
  };
};
export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [searchState, setSearchState] = useState('idle');

  // URL 파라미터에서 검색 조건 추출
  const searchConditions = useMemo(() => extractSearchConditions(searchParams), [searchParams]);
  const {
    keyword,
    techTags,
    companyTags,
    currentPage
  } = searchConditions;

  // 검색 조건이 있는지 확인
  const hasConditions = useMemo(() => hasSearchConditions(keyword, techTags, companyTags), [keyword, techTags, companyTags]);

  // 페이지 변경 핸들러
  const setCurrentPage = useCallback(page => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // 검색 실행 - URL 변경 감지
  useEffect(() => {
    if (!hasConditions) {
      setSearchState('idle');
      setLoading(false);
      setError(null);
      setPosts([]);
      setTotalCount(0);
      setAppliedFilters(null);
      return;
    }
    let isMounted = true;
    const abortController = new AbortController();
    const searchPostsData = async () => {
      if (!isMounted) return;
      setSearchState('loading');
      setLoading(true);
      setError(null);
      try {
        const response = await fetchSearchData(searchConditions.keyword, searchConditions.techTags, searchConditions.companyTags, searchConditions.currentPage, 10, abortController);
        if (!isMounted) return;
        if (response.status !== 'SUCCESS') {
          throw new Error(`검색 API 응답이 성공하지 않았습니다. (${response.status})`);
        }
        const {
          posts: apiPosts,
          pageInfo,
          appliedFilters: responseFilters
        } = response.data;
        if (!apiPosts || !Array.isArray(apiPosts)) {
          throw new Error('검색 결과 데이터 형식이 올바르지 않습니다.');
        }
        const transformedPosts = (apiPosts || []).map(transformApiPostToPost);
        if (!isMounted) return;
        setPosts(transformedPosts);
        const totalElements = pageInfo?.totalElements ?? 0;
        setTotalCount(totalElements);

        // appliedFilters 설정
        const finalFilters = {
          q: responseFilters?.q ?? searchConditions.keyword ?? '',
          techTags: responseFilters?.techTags ?? [],
          companyTags: responseFilters?.companyTags ?? []
        };
        setAppliedFilters(finalFilters);
        setSearchState(totalElements === 0 ? 'no-results' : 'success');
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.';
        setError(errorMessage);
        setSearchState('error');
        setLoading(false);
        setPosts([]);
        setTotalCount(0);
        setAppliedFilters(null);
      }
    };
    searchPostsData();
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [searchConditions, hasConditions]);
  return {
    posts,
    loading,
    error,
    currentPage,
    totalCount,
    appliedFilters,
    setCurrentPage,
    searchState,
    hasSearchConditions: hasConditions
  };
};