import { useState, useEffect } from 'react';
import { PostDetail } from '@/types';

interface PostDetailState {
  post: PostDetail | null;
  loading: boolean;
  error: string | null;
}



export const usePostDetail = (postId: string) => {
  const [state, setState] = useState<PostDetailState>({
    post: null,
    loading: true,
    error: null,
  });

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = () => {
      if (!postId) {
        setState({
          post: null,
          loading: false,
          error: '게시글 ID가 필요합니다.',
        });
        return;
      }

      try {
        console.log('🔍 [usePostDetail] 게시글 상세 정보 가져오기 시작:', postId);
        setState(prev => ({ ...prev, loading: true, error: null }));

        // 실제 API 호출로 대체 예정
        const post = null;

        // 현재는 게시글을 찾을 수 없다고 설정 (실제 API 구현 시 수정)
        console.log('❌ [usePostDetail] 게시글을 찾을 수 없음');
        setState({
          post: null,
          loading: false,
          error: '게시글을 찾을 수 없습니다.',
        });
      } catch (error) {
        console.error('❌ [usePostDetail] 에러:', error);
        setState({
          post: null,
          loading: false,
          error: '게시글을 불러오는 중 오류가 발생했습니다.',
        });
      }
    };

    fetchPostDetail();
  }, [postId]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return {
    ...state,
    formatDate,
    formatNumber,
  };
}; 