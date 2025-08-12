import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/userStore';
import { 
  getSafeProfileUrl, 
  getSafeThumbnailUrl, 
  getSafeBadgeUrl, 
  getSafeCompanyUrl 
} from '@/utils/defaultImages';
import { 
  fetchUserStarList, 
  checkPostStarStatus, 
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
  const { user, starLst, starIdMap, setStarLst, addStarId, removeStarId } = useUserStore();
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);
  const [starId, setStarId] = useState<number | null>(null);
  const [hasCheckedServer, setHasCheckedServer] = useState(false);



  // 초기 상태 설정
  useEffect(() => {
    console.log(`🔄 [useStar] useEffect 실행 - postId: ${postId}, user?.memberId: ${user?.memberId}`);
    
    if (user?.memberId) {
      console.log(`🌐 [useStar] 서버에서 스타 상태 확인`);
      // 서버에서 스타 상태 확인을 위한 직접 호출
      const checkServerStatus = async () => {
        try {
          console.log(`🔍 [useStar] 서버에서 스타 상태 확인 시작 - postId: ${postId}, memberId: ${user.memberId}`);
          
          const result = await fetchUserStarList(user.memberId);
          
          if (result.success) {
            console.log(`📋 [useStar] 서버에서 받은 스타 목록:`, result.stars);
            
            // 현재 게시글의 스타 상태 확인
            console.log(`🔍 [useStar] postId 타입 확인 - postId: "${postId}" (타입: ${typeof postId})`);
            const { isStarred: serverIsStarred, starId: serverStarId } = checkPostStarStatus(postId, result.stars);
            
            console.log(`🎯 [useStar] 현재 게시글 스타 상태 - postId: ${postId}, isStarred: ${serverIsStarred}, serverStarId: ${serverStarId}`);
            
            // 서버 상태를 기준으로 로컬 상태와 전역 상태 동기화
            const localIsStarred = starLst.includes(postId);
            const localStarId = starIdMap.get(postId);
            
            console.log(`🔄 [useStar] 상태 비교 - 로컬: ${localIsStarred}(starId: ${localStarId}), 서버: ${serverIsStarred}(starId: ${serverStarId})`);
            
            // 서버 상태가 다르면 전역 상태 업데이트
            if (serverIsStarred && !localIsStarred) {
              console.log(`➕ [useStar] 전역 상태 동기화 - postId: ${postId}를 스타 목록에 추가`);
              setStarLst([...starLst, postId]);
              if (serverStarId) {
                addStarId(postId, serverStarId);
              }
            } else if (!serverIsStarred && localIsStarred) {
              console.log(`➖ [useStar] 전역 상태 동기화 - postId: ${postId}를 스타 목록에서 제거`);
              setStarLst(starLst.filter((id: string) => id !== postId));
              removeStarId(postId);
            }
            
            // UI 상태 업데이트 (서버 상태 기준)
            setIsStarred(serverIsStarred);
            setStarId(serverStarId);
            setHasCheckedServer(true);
            
            console.log(`✅ [useStar] 서버 상태 확인 완료 - postId: ${postId}, isStarred: ${serverIsStarred}, starId: ${serverStarId}`);
          } else {
            console.log(`❌ [useStar] 서버 상태 확인 실패 - postId: ${postId}, error: ${result.error}`);
            // 서버 확인 실패 시 로컬 상태 사용
            const localIsStarred = starLst.includes(postId);
            const localStarId = starIdMap.get(postId);
            
            setIsStarred(localIsStarred);
            setStarId(localStarId || null);
            setHasCheckedServer(true);
            
            console.log(`🔄 [useStar] 로컬 상태 사용 - postId: ${postId}, isStarred: ${localIsStarred}, starId: ${localStarId}`);
          }
        } catch (err) {
          console.error('❌ [useStar] 서버 상태 확인 중 오류:', err);
          // 오류 발생 시 로컬 상태 사용
          const localIsStarred = starLst.includes(postId);
          const localStarId = starIdMap.get(postId);
          
          setIsStarred(localIsStarred);
          setStarId(localStarId || null);
          setHasCheckedServer(true);
          
          console.log(`🔄 [useStar] 오류로 인한 로컬 상태 사용 - postId: ${postId}, isStarred: ${localIsStarred}, starId: ${localStarId}`);
        }
      };
      
      checkServerStatus();
    } else {
      console.log(`💾 [useStar] 로컬에서 스타 상태 확인`);
      const localIsStarred = starLst.includes(postId);
      const localStarId = starIdMap.get(postId);
      
      setIsStarred(localIsStarred);
      setStarId(localStarId || null);
      setHasCheckedServer(true);
      
      console.log(`🔍 [useStar] 로컬 스타 상태 확인 - postId: ${postId}, isStarred: ${localIsStarred}, starId: ${localStarId}`);
    }
  }, [user?.memberId, postId, starLst, starIdMap, setStarLst, addStarId, removeStarId, fetchUserStarList, checkPostStarStatus]);

  // 스타 토글
  const toggleStar = useCallback(async () => {
    if (isStarLoading || !hasCheckedServer) return;
    
    if (!user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    console.log(`🔄 [useStar] 스타 토글 시작 - postId: ${postId}, 현재 상태: ${isStarred}, starId: ${starId}`);
    console.log(`📊 [useStar] 현재 전역 상태 - starLst: ${starLst}, starIdMap 크기: ${starIdMap.size}`);

    setIsStarLoading(true);
    try {
      if (isStarred) {
        // 스타 취소
        if (!starId) {
          console.error('❌ [useStar] starId가 없습니다. postId:', postId, 'starIdMap:', starIdMap);
          alert('스타 정보를 찾을 수 없습니다.');
          return;
        }

        console.log(`🗑️ [useStar] 스타 취소 요청 - starId: ${starId}`);
        const removeResult = await removeStar(starId);

        if (!removeResult.success) {
          console.error('❌ [useStar] 스타 취소 실패:', removeResult.error);
          throw new Error(removeResult.error || '스타 취소 실패');
        }

        console.log(`✅ [useStar] 스타 취소 성공 - starId: ${starId}`);

        // 전역 상태 업데이트
        const newStarLst = starLst.filter((id: string) => id !== postId);
        setStarLst(newStarLst);
        removeStarId(postId);
        console.log(`🗑️ [useStar] 전역 starLst 업데이트 - 새로운 목록:`, newStarLst);
        
        // UI 상태 업데이트
        setIsStarred(false);
        setStarId(null);
        
        alert('스타를 취소했습니다');
      } else {
        // 스타 추가
        console.log(`⭐ [useStar] 스타 추가 요청 - postId: ${postId}`);
        const addResult = await addStar(user.memberId, postId);

        if (!addResult.success) {
          console.error('❌ [useStar] 스타 추가 실패:', addResult.error);
          
          // 409 Conflict 에러인 경우 서버 상태를 다시 확인
          if (addResult.error?.includes('409') || addResult.error?.includes('STAR-002')) {
            console.log(`🔄 [useStar] 409 에러 발생 - 서버 상태 재확인`);
            // 서버 상태 재확인을 위한 직접 호출
            if (user?.memberId) {
              try {
                const result = await fetchUserStarList(user.memberId);
                if (result.success) {
                  const { isStarred: serverIsStarred, starId: serverStarId } = checkPostStarStatus(postId, result.stars);
                  setIsStarred(serverIsStarred);
                  setStarId(serverStarId);
                  
                  // 전역 상태 동기화
                  if (serverIsStarred && !starLst.includes(postId)) {
                    setStarLst([...starLst, postId]);
                    if (serverStarId) {
                      addStarId(postId, serverStarId);
                    }
                  } else if (!serverIsStarred && starLst.includes(postId)) {
                    setStarLst(starLst.filter((id: string) => id !== postId));
                    removeStarId(postId);
                  }
                }
              } catch (recheckError) {
                console.error('❌ [useStar] 서버 상태 재확인 실패:', recheckError);
              }
            }
            console.log(`✅ [useStar] 409 에러 처리 완료 - 서버 상태로 동기화됨`);
            return; // 에러를 던지지 않고 종료
          }
          
          throw new Error(addResult.error || '스타 추가 실패');
        }

        console.log(`✅ [useStar] 스타 추가 성공 - 응답:`, addResult.data);
        
        // 전역 상태 업데이트
        const newStarLst = [...starLst, postId];
        setStarLst(newStarLst);
        console.log(`💾 [useStar] 전역 starLst 업데이트 - 새로운 목록:`, newStarLst);
        
        if (addResult.starId) {
          console.log(`💾 [useStar] starId 저장 - postId: ${postId}, starId: ${addResult.starId}`);
          setStarId(addResult.starId);
          addStarId(postId, addResult.starId);
        } else {
          console.warn('⚠️ [useStar] 응답에 starId가 없습니다:', addResult);
        }
        
        // UI 상태 업데이트
        setIsStarred(true);
        
        alert('스타했습니다');
      }
    } catch (err) {
      console.error('❌ [useStar] 스타 요청 실패:', err);
      
      // 에러 메시지에서 이미 스타했다는 내용이 있으면 서버 상태 재확인
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('STAR-002') || errorMessage.includes('이미 스타를 누른')) {
        console.log(`🔄 [useStar] STAR-002 에러 - 서버 상태 재확인`);
        // 서버 상태 재확인을 위한 직접 호출
        if (user?.memberId) {
          try {
            const result = await fetchUserStarList(user.memberId);
            if (result.success) {
              const { isStarred: serverIsStarred, starId: serverStarId } = checkPostStarStatus(postId, result.stars);
              setIsStarred(serverIsStarred);
              setStarId(serverStarId);
              
              // 전역 상태 동기화
              if (serverIsStarred && !starLst.includes(postId)) {
                setStarLst([...starLst, postId]);
                if (serverStarId) {
                  addStarId(postId, serverStarId);
                }
              } else if (!serverIsStarred && starLst.includes(postId)) {
                setStarLst(starLst.filter((id: string) => id !== postId));
                removeStarId(postId);
              }
            }
          } catch (recheckError) {
            console.error('❌ [useStar] 서버 상태 재확인 실패:', recheckError);
          }
        }
        console.log(`✅ [useStar] STAR-002 에러 처리 완료 - 서버 상태로 동기화됨`);
      } else {
        console.error('❌ [useStar] 알 수 없는 에러:', errorMessage);
        alert('스타 요청에 실패했습니다.');
      }
    } finally {
      setIsStarLoading(false);
    }
  }, [isStarred, starId, user?.memberId, postId, starLst, setStarLst, addStarId, removeStarId, isStarLoading, starIdMap, hasCheckedServer, fetchUserStarList, checkPostStarStatus]);

  return {
    isStarred,
    isStarLoading,
    toggleStar
  };
};

// 팔로우 상태 관리 훅
export const useFollow = (postData: PostDetail | null) => {
  const { user, followUser, followCompany, setFollowUser, setFollowCompany } = useUserStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [memberFollowId, setMemberFollowId] = useState<number | null>(null);
  const [companyFollowId, setCompanyFollowId] = useState<number | null>(null);

  // 팔로우 상태 확인
  const checkFollowStatus = useCallback(() => {
    if (!postData) return;

    if (postData.companyId) {
      const isFollowingCompany = followCompany.includes(postData.companyId);
      setIsFollowing(isFollowingCompany);
    } else if (postData.memberId) {
      const isFollowingUser = followUser.includes(postData.memberId);
      setIsFollowing(isFollowingUser);
    }
  }, [postData, followUser, followCompany]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  // 팔로우 토글
  const toggleFollow = useCallback(async () => {
    if (!postData || !user?.memberId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFollowing) {
        // 팔로우 취소
        if (postData.memberId === 1) {
          alert('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (postData.companyId) {
          // 회사 팔로우 취소
          if (!companyFollowId) {
            alert('팔로우 정보를 찾을 수 없습니다.');
            return;
          }
          
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow/${companyFollowId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowCompany(followCompany.filter(id => id !== postData.companyId));
            setIsFollowing(false);
            setCompanyFollowId(null);
            alert('회사 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 취소
          if (!memberFollowId) {
            alert('팔로우 정보를 찾을 수 없습니다.');
            return;
          }
          
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow/${memberFollowId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            setFollowUser(followUser.filter(id => id !== postData.memberId));
            setIsFollowing(false);
            setMemberFollowId(null);
            alert('사용자 팔로우를 취소했습니다.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
      } else {
        // 팔로우 추가
        if (postData.memberId === 1) {
          alert('해당 사용자는 팔로우할 수 없습니다.');
          return;
        }
        
        if (postData.companyId) {
          // 회사 팔로우 추가
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companies/${postData.companyId}/follow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              followerId: user.memberId,
              companyId: postData.companyId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.data?.companyFollowId) {
            setCompanyFollowId(result.data.companyFollowId);
          }

          setFollowCompany([...followCompany, postData.companyId]);
          setIsFollowing(true);
          alert('회사를 팔로우했습니다.');
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
          alert('사용자를 팔로우했습니다.');
        }
      }
    } catch (err) {
      console.error('❌ [useFollow] 팔로우 요청 실패:', err);
      alert('팔로우 요청에 실패했습니다.');
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
      console.error('❌ [useComments] 댓글 추천 상태 확인 실패:', err);
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
    
    const currentUserId = user?.memberId;
    if (!currentUserId || currentUserId <= 0) {
      alert('로그인이 필요합니다.');
      return;
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
          memberId: currentUserId,
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
  }, [commentText, postId, user?.memberId, linkUrl, fetchComments]);

  // 댓글 추천
  const toggleCommentRecommend = useCallback(async (commentId: number) => {
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
  }, [user?.memberId, userRecommendations, recommendLoading]);

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
    addComment,
    toggleCommentRecommend
  };
};

// 통합 훅
export const usePostDetail = (postId: string) => {
  const { postData, loading, error, refetch } = usePostData(postId);
  const { isStarred, isStarLoading, toggleStar } = useStar(postId);
  const { isFollowing, toggleFollow } = useFollow(postData);
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
    addComment,
    toggleCommentRecommend
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
    addComment,
    toggleCommentRecommend
  };
}; 