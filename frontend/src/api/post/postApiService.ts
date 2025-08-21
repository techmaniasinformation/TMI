import { 
  getSafeProfileUrl, 
  getSafeThumbnailUrl, 
  getSafeBadgeUrl, 
  getSafeCompanyUrl 
} from '@/utils/defaultImages';

// 게시글 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface PostDetail {
  postId: string;
  title: string;
  tags: string[];
  memberProfileUrl: string;
  companyProfileUrl: string | null;
  name: string;
  badgeUrl: string;
  createAt: string;
  viewCount: number;
  starCount: number;
  commentCount: number;
  thumbnailUrl: string;
  content: string;
  link: string;
  memberId?: number;
  companyId?: number;
}

export interface PostDetailResponse {
  status: string;
  data: PostDetail;
}

// 게시글 상세 정보 조회
export const fetchPostDetail = async (postId: string): Promise<PostDetail> => {
  if (!postId) {
    throw new Error('게시글 ID가 없습니다.');
  }

  const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: PostDetailResponse = await response.json();
  
  // 이미지 URL 처리를 한 번만 수행
  const postWithDefaultImages = {
    ...data.data,
    memberProfileUrl: getSafeProfileUrl(data.data.memberProfileUrl),
    companyProfileUrl: getSafeCompanyUrl(data.data.companyProfileUrl),
    badgeUrl: getSafeBadgeUrl(data.data.badgeUrl),
    thumbnailUrl: getSafeThumbnailUrl(data.data.thumbnailUrl),
  };
  
  return postWithDefaultImages;
};
