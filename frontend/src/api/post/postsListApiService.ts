import { SearchApiResponse, Post } from '@/types';

// 게시글 목록 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface FetchPostsParams {
  page: number;
  size: number;
  followMemberId?: number;
}

// 실제 API 호출 함수
export const fetchPostsFromAPI = async (params: FetchPostsParams): Promise<SearchApiResponse> => {
  const { page, size, followMemberId } = params;
  
  // 팔로우 API와 최신글 API를 명확히 구분
  let apiUrl: string;
  if (followMemberId) {
    // 팔로우 API: /api/v1/post?followMemberId={:memberId}&page={:page}&size=10
    apiUrl = `${API_BASE_URL}/post?followMemberId=${followMemberId}&page=${page}&size=10`;
    console.log('🔍 팔로우 API 호출:', apiUrl);
  } else {
    // 최신글 API: /api/v1/post?page=1&size=10
    apiUrl = `${API_BASE_URL}/post?page=${page}&size=${size}`;
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

// API 응답을 프론트엔드 타입으로 변환
export const transformApiPosts = (apiPosts: any[]): Post[] => {
  return (apiPosts || []).map((post: any) => ({
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
};
