import { useState } from 'react';
import type { PostDetail } from '@/api/post/postApiService';

// 게시글 데이터 상태 관리 훅
export const usePostDataState = () => {
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    // 상태
    postData,
    loading,
    error,

    // 상태 설정
    setPostData,
    setLoading,
    setError,
  };
};
