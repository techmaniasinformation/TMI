import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useAlertStore } from '@/stores/alertStore';
import { 
  getSafeProfileUrl, 
  getSafeThumbnailUrl, 
  getSafeBadgeUrl, 
  getSafeCompanyUrl 
} from '@/utils/defaultImages';
import { 
  addStar, 
  removeStar 
} from '@/utils/starUtils';

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

 // 스타 상태 관리 훅
export const useStar = (postId: string) => {
  const { user } = useUserStore();
  const { showError, showSuccess } = useAlertStore();
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);

   // 스타 상태 확인
   const checkStarStatus = useCallback(async () => {
     if (!user?.memberId || !postId) return;

     try {
       const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${user.memberId}`, {
         credentials: 'include'
       });
       
       if (response.ok) {
         const data = await response.json();
         const starList = data.data?.stars || [];
         const foundStar = starList.find((star: any) => star.postId.toString() === postId);
         setIsStarred(!!foundStar);
       }
     } catch (error) {
       console.error('스타 상태 확인 실패:', error);
     }
   }, [user?.memberId, postId]);

   useEffect(() => {
     checkStarStatus();
   }, [checkStarStatus]);

   // 스타 토글
   const toggleStar = useCallback(async () => {
     if (isStarLoading) return;
     
     if (!user?.memberId) {
       showError('로그인이 필요합니다.');
       return;
     }

     setIsStarLoading(true);
     try {
       if (isStarred) {
         // 스타 취소 - 서버에서 현재 스타 정보 가져오기
         try {
           const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star?memberId=${user.memberId}`, {
             credentials: 'include'
           });
           
           if (response.ok) {
             const data = await response.json();
             const starList = data.data?.stars || [];
             const foundStar = starList.find((star: any) => star.postId.toString() === postId);
             
             if (foundStar) {
               const removeResult = await removeStar(foundStar.starId.toString());
               
               if (!removeResult.success) {
                 throw new Error(removeResult.error || '스타 취소 실패');
               }
               
               // UI 상태 업데이트
               setIsStarred(false);
               
               showSuccess('스타를 취소했습니다');
             } else {
               showError('스타 정보를 찾을 수 없습니다.');
             }
           } else {
             showError('스타 정보를 찾을 수 없습니다.');
           }
         } catch (error) {
           console.error('스타 취소 실패:', error);
           showError('스타 취소에 실패했습니다.');
         }
       } else {
         // 스타 추가
         const addResult = await addStar(user.memberId, postId);

         if (!addResult.success) {
           throw new Error(addResult.error || '스타 추가 실패');
         }
         
         // UI 상태 업데이트
         setIsStarred(true);
         
         showSuccess('스타했습니다');
       }
     } catch (err) {
       showError('스타 요청에 실패했습니다.');
     } finally {
       setIsStarLoading(false);
     }
   }, [isStarred, user?.memberId, postId, isStarLoading]);

  return {
    isStarred,
    isStarLoading,
    toggleStar
  };
};

// 팔로우 상태 관리 훅
export const useFollow = (postData: PostDetail | null, companyId?: string) => {
  const { user, followUser, followCompany, setFollowUser, setFollowCompany } = useUserStore();
  const { showError, showSuccess } = useAlertStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [memberFollowId, setMemberFollowId] = useState<number | null>(null);
  const [companyFollowId, setCompanyFollowId] = useState<number | null>(null);

  // 팔로우 상태 확인
  const checkFollowStatus = useCallback(() => {
    if (!postData) return;

    const targetCompanyId = companyId || postData.companyId;
    if (targetCompanyId) {
      const isFollowingCompany = followCompany.includes(Number(targetCompanyId));
      setIsFollowing(isFollowingCompany);
    } else if (postData.memberId) {
      const isFollowingUser = followUser.includes(postData.memberId);
      setIsFollowing(isFollowingUser);
    }
  }, [postData, followUser, followCompany, companyId]);

  // user 상태가 로드된 후에 팔로우 상태 확인
  useEffect(() => {
    if (user && postData) {
      checkFollowStatus();
    }
  }, [user, postData, checkFollowStatus]);



  // 팔로우 토글
  const toggleFollow = useCallback(async () => {
    if (!postData) {
      showError('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    // 로그인 상태 확인
    if (!user?.memberId) {
      showError('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFollowing) {
        // 팔로우 취소
        if (postData.memberId === 1 && !postData.companyId) {
          showError('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (companyId || postData.companyId) {
          // 회사 팔로우 취소
          const targetCompanyId = companyId || postData.companyId;
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow?followerId=${user.memberId}&companyId=${targetCompanyId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowCompany(followCompany.filter(id => id !== Number(targetCompanyId)));
            setIsFollowing(false);
            setCompanyFollowId(null);
            showSuccess('회사 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 취소
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow?followerId=${user.memberId}&followeeId=${postData.memberId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowUser(followUser.filter(id => id !== postData.memberId));
            setIsFollowing(false);
            setMemberFollowId(null);
            showSuccess('사용자 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
      } else {
        // 팔로우 추가
        if (postData.memberId === 1 && !postData.companyId) {
          showError('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (companyId || postData.companyId) {
          // 회사 팔로우 추가
          const targetCompanyId = companyId || postData.companyId;
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerId: user.memberId,
              companyId: targetCompanyId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.data?.companyFollowId) {
            setCompanyFollowId(result.data.companyFollowId);
          }

          setFollowCompany([...followCompany, Number(targetCompanyId)]);
          setIsFollowing(true);
          showSuccess('회사를 팔로우했습니다.');
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 추가
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerId: user.memberId,
              followeeId: postData.memberId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.data?.memberFollowId) {
            setMemberFollowId(result.data.memberFollowId);
          }
          
          setFollowUser([...followUser, postData.memberId]);
          setIsFollowing(true);
          showSuccess('사용자를 팔로우했습니다.');
        }
      }
    } catch (err) {
      console.error('❌ [useFollow] 팔로우 요청 실패:', err);
      showError('팔로우 요청에 실패했습니다.');
    }
  }, [isFollowing, postData, user?.memberId, followUser, followCompany, setFollowUser, setFollowCompany, memberFollowId, companyFollowId]);

  return {
    isFollowing,
    toggleFollow
  };
};

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
  const { showError, showSuccess, showWarning } = useAlertStore();

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
      setBestCommentId(data.data?.bestCommentId || -1);
    } catch (err) {
      console.error('❌ [useComments] 댓글 가져오기 실패:', err);
      setComments([]);
      setBestCommentId(-1);
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
      showWarning('댓글 내용을 입력해주세요.');
      return;
    }
    
    // 로그인 상태 확인
    if (!user?.memberId) {
      showError('로그인이 필요합니다.');
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
          showError('http 또는 https URL을 입력해주세요.');
          return;
        }
        const hostname = urlObj.hostname.toLowerCase();
        if (!hostname.includes('tistory.com') && !hostname.includes('velog.io') && !hostname.includes('blog.naver.com') && !hostname.includes('medium.com')) {
          showError('티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.');
          return;
        }
      } catch (error) {
        showError('올바른 URL 형식을 입력해주세요.');
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
      showSuccess('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      showError('댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  }, [commentText, postId, user, linkUrl, fetchComments]);

  // 댓글 추천
  const toggleCommentRecommend = useCallback(async (commentId: number) => {
    // 로그인 상태 확인
    if (!user?.memberId) {
      showError('로그인이 필요합니다.');
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
          showError('추천 정보를 찾을 수 없습니다.');
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

        showSuccess('추천을 취소했습니다.');
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

        showSuccess('댓글을 추천했습니다.');
      }
    } catch (err) {
      console.error('❌ [useComments] 댓글 추천 요청 실패:', err);
      showError('추천 요청에 실패했습니다.');
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
      showError('로그인이 필요합니다.');
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
      
      showSuccess('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('❌ [useComments] 댓글 삭제 요청 실패:', err);
      showError('댓글 삭제에 실패했습니다.');
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

// 통합 훅
export const usePostDetail = (postId: string, companyId?: string) => {
  const { postData, loading, error, refetch } = usePostData(postId);
  const { isStarred, isStarLoading, toggleStar } = useStar(postId);
  const { isFollowing, toggleFollow } = useFollow(postData, companyId);
  const {
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
  } = useComments(postId);

  return {
    // 게시글 데이터
    postData,
    loading,
    error,
    refetch,
    
    // 스타 관련
    isStarred,
    isStarLoading,
    toggleStar,
    
    // 팔로우 관련
    isFollowing,
    toggleFollow,
    
    // 댓글 관련
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