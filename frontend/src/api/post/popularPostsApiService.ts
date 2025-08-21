import { Post } from '@/types';

// 인기 게시글 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

// 인기게시글 API 호출 함수
export const fetchPopularPosts = async (size: number = 3): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/popular?size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답을 프론트엔드 타입으로 변환
    const transformedPosts = (data.data?.posts || []).map((post: any) => ({
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

    return transformedPosts;
  } catch (error) {
    console.error('❌ [fetchPopularPosts] API 호출 실패:', error);
    throw error;
  }
};
