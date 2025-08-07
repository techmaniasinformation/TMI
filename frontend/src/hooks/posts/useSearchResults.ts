import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, AppliedFilters } from '@/types';

const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 백엔드 API 응답 타입 (실제 응답에 맞게 수정)
interface SearchApiPost {
  postId: string; // 백엔드에서 문자열로 전달됨
  memberProfile: string; // memberProfileUrl이 아닌 memberProfile
  companyProfileUrl: string | null;
  name: string;
  badgeUrl: string | null; // null일 수 있음
  title: string;
  createAt: string; // 백엔드에서 실제로 이렇게 전달됨 (오타지만 실제 응답에 맞춤)
  viewCount: number;
  starCount: number;
  commentCount: number;
  tags: string[];
  thumbnailUrl: string;
}

interface SearchApiResponse {
  status: string;
  data: {
    posts: SearchApiPost[];
    pageInfo: {
      totalElements: number;
      totalPages: number;
      isLast: boolean;
      currPage: number;
    };
    appliedFilters: {
      q: string;
      techTags: string[];
      companyTags: string[];
    };
  };
}

interface SearchResults {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  appliedFilters: AppliedFilters | null;
  setCurrentPage: (page: number) => void;
}

// API에서 검색 데이터를 가져오는 함수
const fetchSearchData = async (
  keyword: string, 
  techTagIds: string[], 
  companyTagIds: string[], 
  page: number,
  size: number = 10
): Promise<SearchApiResponse> => {
  const params = new URLSearchParams();
  
  // 검색어 (q)
  if (keyword.trim()) {
    params.append('q', keyword.trim());
  }
  
  // 기술 태그 IDs
  if (techTagIds.length > 0) {
    params.append('techTags', techTagIds.join(','));
  }
  
  // 회사 태그 IDs  
  if (companyTagIds.length > 0) {
    params.append('companyTags', companyTagIds.join(','));
  }
  
  // 페이지네이션
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  const url = `${API_BASE_URL}/post/search?${params.toString()}`;
  
  console.log('🔍 [fetchSearchData] API 호출:', url);
  console.log('🔍 [fetchSearchData] 생성된 파라미터:', {
    keyword,
    techTagIds,
    companyTagIds,
    page,
    size
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: 인증이 필요한 경우 Authorization 헤더 추가
        // 'Authorization': `Bearer ${accessToken}`
      },
    });
    
    console.log('🔍 [fetchSearchData] 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      // HTTP 상태 코드별 구체적인 에러 메시지
      let errorMessage = '검색 중 오류가 발생했습니다';
      
      switch (response.status) {
        case 400:
          errorMessage = '검색 조건이 올바르지 않습니다. 검색어나 태그를 확인해주세요.';
          break;
        case 401:
          errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
          break;
        case 403:
          errorMessage = '검색 권한이 없습니다. 관리자에게 문의해주세요.';
          break;
        case 404:
          errorMessage = '검색 서비스를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 429:
          errorMessage = '너무 많은 검색 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = '서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          errorMessage = `검색 중 오류가 발생했습니다. (${response.status})`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ [fetchSearchData] API 응답:', data);
    
    return data;
  } catch (error) {
    console.error('❌ [fetchSearchData] API 호출 오류:', error);
    
    // 네트워크 오류인 경우
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('네트워크 연결을 확인해주세요. 인터넷 연결 상태를 점검해주세요.');
    }
    
    // 이미 처리된 에러는 그대로 전달
    if (error instanceof Error) {
      throw error;
    }
    
    // 기타 예상치 못한 오류
    throw new Error('예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

// 백엔드 응답을 프론트엔드 타입으로 변환하는 함수
const transformApiPostToPost = (apiPost: SearchApiPost): Post => {
  return {
    postId: parseInt(apiPost.postId), // 문자열을 숫자로 변환
    title: apiPost.title,
    content: '', // API 응답에는 없으므로 빈 문자열
    tags: apiPost.tags,
    memberProfileUrl: apiPost.memberProfile, // memberProfile 필드 사용
    companyProfileUrl: apiPost.companyProfileUrl || undefined,
    name: apiPost.name,
    badgeUrl: apiPost.badgeUrl || '', // null일 수 있으므로 빈 문자열로 처리
    createAt: apiPost.createAt,
    viewCount: apiPost.viewCount,
    starCount: apiPost.starCount,
    commentCount: apiPost.commentCount,
    thumbnailUrl: apiPost.thumbnailUrl,
    link: '', // API 응답에는 없으므로 빈 문자열
    isStar: false // 기본값
  };
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
    const keyword = searchParams.get('q') ?? searchParams.get('keyword') ?? ''; // 'q' 우선, 호환성을 위해 'keyword'도 지원
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
    console.log('🔍 [useSearchResults] useEffect 실행:', {
      searchConditions,
      hasSearchConditions,
      loading: loading,
      currentPosts: posts.length,
      currentTotalCount: totalCount
    });
    
    // 검색 조건이 없으면 로딩 상태를 false로 설정하고 종료
    if (!hasSearchConditions) {
      console.log('🔍 [useSearchResults] 검색 조건 없음 - 상태 초기화');
      setLoading(false);
      setError(null);
      setPosts([]);
      setTotalCount(0);
      setAppliedFilters(null);
      // 이전 검색 조건도 초기화
      prevSearchConditionsRef.current = '';
      return;
    }

    // 현재 검색 조건을 문자열로 변환
    const currentSearchConditions = JSON.stringify(searchConditions);
    
    // 이전 검색 조건과 동일하면 API 호출하지 않음
    if (prevSearchConditionsRef.current === currentSearchConditions) {
      console.log('🔍 [useSearchResults] 이전 검색 조건과 동일 - API 호출 건너뜀');
      return;
    }
    
    // 이전 검색 조건 업데이트
    prevSearchConditionsRef.current = currentSearchConditions;

    let isMounted = true;
    let abortController = new AbortController();
    
    const searchPostsData = async () => {
      if (!isMounted) return;
      
      console.log('🔍 [useSearchResults] 검색 시작 - 로딩 상태 true로 설정');
      setLoading(true);
      setError(null);
      console.log('🔍 [useSearchResults] 로딩 상태 true로 설정 완료');

      try {
        // URL에서 받은 태그들은 이미 ID 형태이므로 그대로 사용
        console.log('🔍 [useSearchResults] 검색 파라미터:', { 
          searchConditions
        });
        
        // 실제 API 호출 (비동기)
        const response = await fetchSearchData(
          searchConditions.keyword, 
          searchConditions.techTags, 
          searchConditions.companyTags, 
          searchConditions.currentPage
        );

        if (!isMounted) {
          console.log('🔍 [useSearchResults] 컴포넌트 언마운트됨 - 상태 업데이트 중단');
          return;
        }

        console.log('🔍 [useSearchResults] API 응답 상태:', response.status);
        console.log('🔍 [useSearchResults] 전체 응답 데이터:', response);
        
        if (response.status !== 'SUCCESS') {
          console.error('❌ [useSearchResults] API 응답 상태가 SUCCESS가 아님:', response.status);
          throw new Error('검색 API 응답이 성공하지 않았습니다.');
        }

        const { posts: apiPosts, pageInfo, appliedFilters: responseFilters } = response.data;

        console.log('✅ [useSearchResults] 파싱된 데이터:', {
          apiPosts: apiPosts,
          apiPostsLength: apiPosts?.length ?? 0,
          pageInfo: pageInfo,
          responseFilters: responseFilters
        });

        console.log('✅ [useSearchResults] 검색 완료:', {
          totalElements: pageInfo?.totalElements ?? 0,
          totalPages: pageInfo?.totalPages ?? 1,
          currentPage: pageInfo?.currPage ?? 1,
          postsCount: apiPosts?.length ?? 0,
          appliedFilters: responseFilters
        });

        // API 응답을 프론트엔드 Post 타입으로 변환
        if (!apiPosts || !Array.isArray(apiPosts)) {
          console.error('❌ [useSearchResults] apiPosts가 배열이 아님:', apiPosts);
          throw new Error('검색 결과 데이터 형식이 올바르지 않습니다.');
        }

        const transformedPosts = apiPosts.map(transformApiPostToPost);
        
        console.log('🔍 [useSearchResults] 변환된 포스트:', transformedPosts);

        // 모든 상태 업데이트를 한 번에 처리
        console.log('🔍 [useSearchResults] 상태 업데이트 시작');
        
        setPosts(transformedPosts);
        const totalElements = pageInfo?.totalElements ?? 0;
        setTotalCount(totalElements);
        
        // appliedFilters를 프론트엔드 형식으로 변환
        const transformedFilters: AppliedFilters = {
          q: responseFilters?.q || '',
          techTags: responseFilters?.techTags || [],
          companyTags: responseFilters?.companyTags || []
        };
        setAppliedFilters(transformedFilters);

        console.log('🔄 [useSearchResults] 모든 상태 업데이트 완료:', {
          postsLength: transformedPosts.length,
          totalCount: totalElements,
          filters: transformedFilters
        });

        // 모든 상태 업데이트 후 로딩 상태를 false로 설정
        console.log('🔍 [useSearchResults] 로딩 상태 false로 설정 시작');
        setLoading(false);
        console.log('🔍 [useSearchResults] 로딩 상태 false로 설정 완료');

      } catch (err) {
        if (!isMounted) {
          console.log('🔍 [useSearchResults] 컴포넌트 언마운트됨 - 에러 처리 중단');
          return;
        }
        
        console.error('❌ [useSearchResults] Search error:', err);
        
        // 에러 메시지 처리
        let errorMessage = '검색 중 오류가 발생했습니다.';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else {
          console.error('❌ [useSearchResults] 예상치 못한 에러 타입:', err);
          errorMessage = '예상치 못한 오류가 발생했습니다.';
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // 에러 발생 시 상태 초기화
        setPosts([]);
        setTotalCount(0);
        setAppliedFilters(null);
      }
    };

    searchPostsData();

    return () => {
      console.log('🔍 [useSearchResults] useEffect cleanup 실행');
      isMounted = false;
      abortController.abort();
    };
  }, [searchConditions, hasSearchConditions]);

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