import { useState, useEffect, useCallback } from 'react';
import { 
  getSafeProfileUrl, 
  getSafeThumbnailUrl, 
  getSafeBadgeUrl, 
  getSafeCompanyUrl 
} from '@/utils/defaultImages';

interface PostDetail {
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

interface PostDetailResponse {
  status: string;
  data: PostDetail;
}

// 게시글 데이터 관리 훅
export const usePostData = (postId: string) => {
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostDetail = useCallback(async () => {
    if (!postId) {
      setError('게시글 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postId}`, {
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
      
      setPostData(postWithDefaultImages);
    } catch (err) {
      console.error('❌ [usePostData] 게시글 상세 정보 가져오기 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  return {
    postData,
    loading,
    error,
    refetch: fetchPostDetail
  };
};

export type { PostDetail };
