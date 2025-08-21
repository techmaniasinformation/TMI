import { Post, SearchApiResponse } from '@/types';

// 검색 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface SearchParams {
  keyword: string;
  techTagIds: string[];
  companyTagIds: string[];
  page: number;
  size?: number;
}

// API에서 검색 데이터를 가져오는 함수
export const fetchSearchData = async (
  params: SearchParams,
  abortController?: AbortController
): Promise<SearchApiResponse> => {
  const { keyword, techTagIds, companyTagIds, page, size = 10 } = params;
  
  const urlParams = new URLSearchParams();
  
  if (keyword.trim()) {
    urlParams.append('q', keyword.trim());
  }
  
  if (techTagIds.length > 0) {
    urlParams.append('techTags', techTagIds.join(','));
  }
  
  if (companyTagIds.length > 0) {
    urlParams.append('companyTags', companyTagIds.join(','));
  }
  
  urlParams.append('page', page.toString());
  urlParams.append('size', size.toString());
  
  const url = `${API_BASE_URL}/post/search?${urlParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController?.signal,
  });
  
  if (!response.ok) {
    throw new Error(`검색 중 오류가 발생했습니다. (${response.status})`);
  }
  
  return await response.json();
};

// 백엔드 응답을 프론트엔드 타입으로 변환하는 함수
export const transformApiPostToPost = (apiPost: any): Post => {
  return {
    postId: apiPost.postId,
    title: apiPost.title,
    content: '',
    tags: apiPost.tags,
    memberProfileUrl: apiPost.memberProfile || '', // API: memberProfile -> Frontend: memberProfileUrl
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
