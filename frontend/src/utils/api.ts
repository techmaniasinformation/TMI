import postsData from '@/data/posts.json';
import { SearchApiResponse, Post, PageInfo } from '@/types';

// JSON 데이터에서 게시글 목록 가져오기
export const getPostsFromJson = async (params: {
  page?: number;
  size?: number;
  sort?: 'latest' | 'following';
}): Promise<SearchApiResponse> => {
  const { page = 1, size = 10, sort = 'latest' } = params;
  
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allPosts = postsData.data.posts;
  
  // 정렬 (최신순 또는 팔로우순)
  let sortedPosts = [...allPosts];
  if (sort === 'latest') {
    sortedPosts.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
  } else if (sort === 'following') {
    // 팔로우순은 임시로 랜덤 정렬 (실제로는 팔로우 정보 필요)
    sortedPosts.sort(() => Math.random() - 0.5);
  }
  
  // 페이지네이션
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  
  // 페이지 정보 계산
  const totalElements = allPosts.length;
  const totalPages = Math.ceil(totalElements / size);
  const isLast = page >= totalPages;
  
  const pageInfo: PageInfo = {
    totalElements,
    totalPages,
    isLast,
    currPage: page
  };
  
  console.log('📄 getPostsFromJson:', {
    params,
    totalElements,
    totalPages,
    currentPage: page,
    postsCount: paginatedPosts.length,
    isLast
  });
  
  return {
    status: 'SUCCESS',
    data: {
      posts: paginatedPosts,
      pageInfo
    }
  };
};

// 검색 API 시뮬레이션
export const searchPostsFromJson = async (params: {
  q?: string;
  techTags?: string;
  companyTags?: string;
  page?: number;
  size?: number;
}): Promise<SearchApiResponse> => {
  const { q = '', techTags = '', companyTags = '', page = 1, size = 10 } = params;
  
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allPosts = postsData.data.posts;
  
  console.log('🔍 [DEBUG] 검색 파라미터:', { q, techTags, companyTags, page, size });
  console.log('🔍 [DEBUG] 전체 게시글 수:', allPosts.length);
  
  // 검색 필터링
  let filteredPosts = allPosts.filter(post => {
    // 키워드 검색 (제목이나 태그에서 검색)
    const matchesKeyword = !q || 
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()));
    
    // 기술 태그 필터링 - techTags는 쉼표로 구분된 태그 이름들
    let matchesTechTags = true;
    if (techTags) {
      const techTagNames = techTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (techTagNames.length > 0) {
        matchesTechTags = techTagNames.some(tagName => 
          post.tags.some(postTag => 
            postTag.toLowerCase().includes(tagName.toLowerCase())
          )
        );
      }
    }
    
    // companyTags 필터링 - companyTags는 쉼표로 구분된 태그 이름들
    let matchesCompanyTags = true;
    if (companyTags) {
      const companyTagNames = companyTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (companyTagNames.length > 0) {
        // 현재 posts 데이터에는 회사 태그가 없으므로 임시로 true
        matchesCompanyTags = true;
      }
    }
    
    return matchesKeyword && matchesTechTags && matchesCompanyTags;
  });
  
  console.log('🔍 [DEBUG] 필터링 후 게시글 수:', filteredPosts.length);
  
  // 페이지네이션
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  console.log('🔍 [DEBUG] 페이지네이션 범위:', { startIndex, endIndex, page, size });
  console.log('🔍 [DEBUG] 페이지네이션 결과:', paginatedPosts.length);
  
  // 페이지 정보 계산
  const totalElements = filteredPosts.length;
  const totalPages = Math.ceil(totalElements / size);
  const isLast = page >= totalPages;
  
  const pageInfo: PageInfo = {
    totalElements,
    totalPages,
    isLast,
    currPage: page
  };
  
  console.log('🔍 searchPostsFromJson:', {
    params,
    totalElements,
    totalPages,
    currentPage: page,
    postsCount: paginatedPosts.length,
    isLast
  });
  
  // appliedFilters 생성
  let appliedFilters = undefined;
  if (q || techTags || companyTags) {
    appliedFilters = {
      q: q || undefined,
      techTags: techTags ? techTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : undefined,
      companyTags: companyTags ? companyTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : undefined
    };
  }
  
  return {
    status: 'SUCCESS',
    data: {
      posts: paginatedPosts,
      pageInfo,
      appliedFilters
    }
  };
}; 