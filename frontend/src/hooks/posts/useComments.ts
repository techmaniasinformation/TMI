import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { 
  getSafeProfileUrl, 
  getSafeBadgeUrl 
} from '@/utils/defaultImages';

interface Comment {
  commentId: number;
  comment: string;
  name: string;
  memberProfileUrl: string;
  badgeUrl?: string;
  createAt: string;
  isRecommend: boolean;
  recommendCount: number;
  link?: string;
  memberId?: number;
}

interface CommentResponse {
  status: string;
  data: {
    comments: Comment[];
    bestCommentId: number;
  };
}

// 댓글 관리 훅
export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [bestCommentId, setBestCommentId] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [userRecommendations, setUserRecommendations] = useState<Map<number, number>>(new Map());
  const [recommendLoading, setRecommendLoading] = useState<Map<number, boolean>>(new Map());
  const [deleteLoading, setDeleteLoading] = useState<Map<number, boolean>>(new Map());
  const { user } = useUserStore();

  // 댓글 목록 가져오기
  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment?postId=${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const commentsWithDefaultImages = (data.data?.comments || []).map((comment: Comment) => ({
        ...comment,
        memberProfileUrl: getSafeProfileUrl(comment.memberProfileUrl),
        badgeUrl: getSafeBadgeUrl(comment.badgeUrl),
      }));
      
      setComments(commentsWithDefaultImages);
      // bestCommentId가 유효한 값인 경우에만 설정, 그렇지 않으면 -1로 설정
      const validBestCommentId = data.data?.bestCommentId && data.data.bestCommentId > 0 ? data.data.bestCommentId : -1;
      setBestCommentId(validBestCommentId);
    } catch (err) {
      console.error('❌ [useComments] 댓글 가져오기 실패:', err);
      setComments([]);
      setBestCommentId(-1); // 에러 시에도 -1로 설정하여 안전하게 처리
    }
  }, [postId]);

  // 댓글 추천 상태 확인
  const checkUserRecommendations = useCallback(async () => {
    if (!user?.memberId || !postId) return;

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/recommendation?memberId=${user.memberId}&postId=${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        const recommendations = result.data?.recommendations || [];
        
        const recommendationMap = new Map();
        recommendations.forEach((rec: any) => {
          recommendationMap.set(rec.commentId, rec.recommendationId);
        });
        
        setUserRecommendations(recommendationMap);
      }
    } catch (err) {
      // 에러 무시
    }
  }, [user?.memberId, postId]);

  useEffect(() => {
    fetchComments();
    checkUserRecommendations();
  }, [fetchComments, checkUserRecommendations]);

  // 댓글 추가
  const addComment = useCallback(async () => {
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    
    // 로그인 상태 확인
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // URL 검증
    if (linkUrl.trim()) {
      let processedUrl = linkUrl;
      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
        processedUrl = `https://${linkUrl}`;
      }
      try {
        const urlObj = new URL(processedUrl);
        if (!urlObj.protocol || (!urlObj.protocol.startsWith('http'))) {
          alert('http 또는 https URL을 입력해주세요.');
          return;
        }
        const hostname = urlObj.hostname.toLowerCase();
        if (!hostname.includes('tistory.com') && !hostname.includes('velog.io') && !hostname.includes('blog.naver.com') && !hostname.includes('medium.com')) {
          alert('티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.');
          return;
        }
      } catch (error) {
        alert('올바른 URL 형식을 입력해주세요.');
        return;
      }
    }

    setCommentLoading(true);
    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId: postId,
          memberId: user.memberId,
          comment: commentText,
          link: linkUrl || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchComments();
      
      setCommentText('');
      setLinkUrl('');
      setShowLinkInput(false);
      alert('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  }, [commentText, postId, user, linkUrl, fetchComments]);

  // 댓글 추천
  const toggleCommentRecommend = useCallback(async (commentId: number) => {
    // 로그인 상태 확인
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (recommendLoading.get(commentId)) return;

    setRecommendLoading(prev => new Map(prev).set(commentId, true));

    try {
      const isCurrentlyRecommended = userRecommendations.has(commentId);

      if (isCurrentlyRecommended) {
        // 추천 취소
        const recommendationId = userRecommendations.get(commentId);
        if (!recommendationId) {
          alert('추천 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/recommendation/${recommendationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setUserRecommendations(prev => {
          const newMap = new Map(prev);
          newMap.delete(commentId);
          return newMap;
        });

        setComments(prev => prev.map(comment => 
          comment.commentId === commentId 
            ? { ...comment, recommendCount: Math.max(0, comment.recommendCount - 1) }
            : comment
        ));

        alert('추천을 취소했습니다.');
      } else {
        // 추천 추가
        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/recommendation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberId: user.memberId,
            commentId: commentId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data?.recommendationId) {
          setUserRecommendations(prev => {
            const newMap = new Map(prev);
            newMap.set(commentId, result.data.recommendationId);
            return newMap;
          });
        }

        setComments(prev => prev.map(comment => 
          comment.commentId === commentId 
            ? { ...comment, recommendCount: comment.recommendCount + 1 }
            : comment
        ));

        alert('댓글을 추천했습니다.');
      }
    } catch (err) {
      console.error('❌ [useComments] 댓글 추천 요청 실패:', err);
      alert('추천 요청에 실패했습니다.');
    } finally {
      setRecommendLoading(prev => {
        const newMap = new Map(prev);
        newMap.delete(commentId);
        return newMap;
      });
    }
  }, [user, userRecommendations, recommendLoading]);

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId: number) => {
    // 로그인 상태 확인
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (deleteLoading.get(commentId)) return;

    setDeleteLoading(prev => new Map(prev).set(commentId, true));

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 댓글 목록에서 삭제된 댓글 제거
      setComments(prev => prev.filter(comment => comment.commentId !== commentId));
      
      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('❌ [useComments] 댓글 삭제 요청 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(prev => {
        const newMap = new Map(prev);
        newMap.delete(commentId);
        return newMap;
      });
    }
  }, [user, deleteLoading]);

  return {
    comments,
    bestCommentId,
    commentText,
    setCommentText,
    showLinkInput,
    setShowLinkInput,
    linkUrl,
    setLinkUrl,
    commentLoading,
    userRecommendations,
    recommendLoading,
    deleteLoading,
    addComment,
    toggleCommentRecommend,
    deleteComment
  };
};

export type { Comment };
