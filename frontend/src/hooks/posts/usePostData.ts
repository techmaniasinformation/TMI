import { useState, useEffect, useCallback } from 'react';
import { fetchPostDetail, type PostDetail } from '@/api/post/postDetailService';

// 게시글 데이터 관리 훅
export const usePostData = (postId: string) => {
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostDetailData = useCallback(async () => {
    if (!postId) {
      setError('게시글 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPostDetail(postId);
      setPostData(data);
    } catch (err) {
      console.error('❌ [usePostData] 게시글 상세 정보 가져오기 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetailData();
  }, [fetchPostDetailData]);

  return {
    postData,
    loading,
    error,
    refetch: fetchPostDetailData
  };
};

export type { PostDetail };

