import { useState, useEffect } from 'react';
import { PostDetail } from '@/types';

// JSON 파일을 직접 import
import postDetailData from '@/data/post-detail.json';

interface PostDetailState {
  post: PostDetail | null;
  loading: boolean;
  error: string | null;
}

// JSON 데이터에서 게시글 상세 정보를 가져오는 함수
const getPostDetailFromJson = (postId: string): PostDetail | null => {
  try {
    console.log('🔍 [getPostDetailFromJson] 게시글 ID:', postId);
    
    // 현재는 고정된 데이터를 반환 (실제로는 postId에 따라 다른 데이터를 반환해야 함)
    const postDetail = (postDetailData as any).data;
    
    if (postDetail && postDetail.postId.toString() === postId) {
      console.log('✅ [getPostDetailFromJson] 게시글 상세 정보 찾음:', postDetail.title);
      return postDetail;
    } else {
      console.log('❌ [getPostDetailFromJson] 게시글을 찾을 수 없음');
      return null;
    }
  } catch (error) {
    console.error('❌ [getPostDetailFromJson] 에러:', error);
    return null;
  }
};

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

        // JSON 파일에서 게시글 상세 정보 찾기
        const post = getPostDetailFromJson(postId);

        if (post) {
          console.log('✅ [usePostDetail] 게시글 상세 정보 가져오기 완료:', {
            postId: post.postId,
            title: post.title,
            author: post.name
          });

          setState({
            post,
            loading: false,
            error: null,
          });
        } else {
          console.log('❌ [usePostDetail] 게시글을 찾을 수 없음');
          setState({
            post: null,
            loading: false,
            error: '게시글을 찾을 수 없습니다.',
          });
        }
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