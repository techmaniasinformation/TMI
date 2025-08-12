// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/foundation/button";
import { PostHeader } from "@/components/PostDetail/PostHeader";
import { PostTitle } from "@/components/PostDetail/PostTitle";
import { PostContent } from "@/components/PostDetail/PostContent";
import { AuthorInfo } from "@/components/PostDetail/AuthorInfo";
import { CommentSection } from "@/components/PostDetail/CommentSection";
import { BestComments } from "@/components/PostDetail/BestComments";
import { useUserStore } from "@/stores/userStore";
import { 
  getSafeProfileUrl, 
  getSafeThumbnailUrl, 
  getSafeBadgeUrl, 
  getSafeCompanyUrl 
} from "@/utils/defaultImages";


interface PostDetailPageProps {}

interface PostDetail {
  postId: number;
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
  memberId?: number; // 개인 사용자 ID
  companyId?: number; // 회사 ID
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

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, starLst, setStarLst, followUser, followCompany, setFollowUser, setFollowCompany } = useUserStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);
  const [starId, setStarId] = useState<number | null>(null);
  const [memberFollowId, setMemberFollowId] = useState<number | null>(null);
  const [companyFollowId, setCompanyFollowId] = useState<number | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [bestCommentId, setBestCommentId] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  
  // 댓글 추천 관련 상태
  const [userRecommendations, setUserRecommendations] = useState<Map<number, number>>(new Map()); // commentId -> recommendationId
  const [recommendLoading, setRecommendLoading] = useState<Map<number, boolean>>(new Map()); // commentId -> loading state

  // 게시글 데이터 상태
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자의 스타 상태 확인 함수 (전역 상태 사용)
  const checkUserStarStatus = useCallback((postId: number) => {
    // 전역 상태의 starLst에서 현재 게시글 ID가 있는지 확인
    const isStarred = starLst.includes(postId);
    setIsStarred(isStarred);
    
    // 스타된 상태라면 starId는 나중에 스타 추가 시 받아올 예정
    if (!isStarred) {
      setStarId(null);
    }
  }, [starLst]);

  // 사용자의 팔로우 상태 확인 함수 (전역 상태 사용)
  const checkUserFollowStatus = useCallback((authorId: number, isCompany: boolean = false) => {
    if (isCompany) {
      // 회사 팔로우 상태 확인
      const isFollowingCompany = followCompany.includes(authorId);
      setIsFollowing(isFollowingCompany);
    } else {
      // 개인 사용자 팔로우 상태 확인
      const isFollowingUser = followUser.includes(authorId);
      setIsFollowing(isFollowingUser);
    }
  }, [followUser, followCompany]);

  // 사용자의 댓글 추천 상태 확인 함수
  const checkUserRecommendations = useCallback(async (postId: number, userId: number) => {
    if (!userId) return;

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/recommendation?memberId=${userId}&postId=${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        const recommendations = result.data?.recommendations || [];
        
        // Map으로 변환: commentId -> recommendationId
        const recommendationMap = new Map();
        recommendations.forEach((rec: any) => {
          recommendationMap.set(rec.commentId, rec.recommendationId);
        });
        
        setUserRecommendations(recommendationMap);
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 댓글 추천 상태 확인 실패:', err);
    }
  }, []);

  // 게시글 상세 정보 가져오기 함수를 useCallback으로 메모이제이션
  const fetchPostDetail = useCallback(async () => {
    if (!id) {
      setError('게시글 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 실제 인증 토큰이 있다면 추가
          // 'Authorization': `Bearer ${accessToken}`
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
      
      // 게시글 로드 후 사용자의 스타 상태 확인
      checkUserStarStatus(data.data.postId);
      
      // 게시글 로드 후 사용자의 팔로우 상태 확인
      if (data.data.companyId) {
        // 회사 작성자인 경우
        checkUserFollowStatus(data.data.companyId, true);
      } else if (data.data.memberId) {
        // 개인 사용자 작성자인 경우
        checkUserFollowStatus(data.data.memberId, false);
      }
      
      // 게시글 로드 후 사용자의 댓글 추천 상태 확인
          if (user?.memberId) {
      await checkUserRecommendations(data.data.postId, user.memberId);
    }
    } catch (err) {
      console.error('❌ [PostDetailPage] 게시글 상세 정보 가져오기 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id, checkUserStarStatus, checkUserFollowStatus, checkUserRecommendations]);

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  // 댓글 목록 가져오기 함수를 useCallback으로 메모이제이션
  const fetchComments = useCallback(async () => {
    if (!postData?.postId) return;

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment?postId=${postData.postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 댓글에 기본 이미지 적용 (한 번만 처리)
      const commentsWithDefaultImages = (data.data?.comments || []).map((comment: Comment) => ({
        ...comment,
        memberProfileUrl: getSafeProfileUrl(comment.memberProfileUrl),
        badgeUrl: getSafeBadgeUrl(comment.badgeUrl),
      }));
      
      setComments(commentsWithDefaultImages);
      setBestCommentId(data.data?.bestCommentId || -1);
    } catch (err) {
      console.error('❌ [PostDetailPage] 댓글 가져오기 실패:', err);
      setComments([]);
      setBestCommentId(-1);
    }
  }, [postData?.postId]);

  // 댓글 목록 가져오기
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 토스트 메시지 표시 함수를 useCallback으로 메모이제이션
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // 팔로우 핸들러를 useCallback으로 메모이제이션
  const handleFollow = useCallback(async () => {
    if (!postData) {
      showToastMessage('게시글 정보를 찾을 수 없습니다.');
      return;
    }

    if (!user?.memberId) {
      showToastMessage('로그인이 필요합니다.');
      return;
    }

    try {
      if (isFollowing) {
        // 팔로우 취소
        if (postData.companyId) {
          // 회사 팔로우 취소 - companyFollowId가 없으면 전역 상태에서만 제거
          if (!companyFollowId) {
            // 전역 상태에서만 제거하고 API 호출하지 않음
            setFollowCompany(followCompany.filter(id => id !== postData.companyId));
            setIsFollowing(false);
            showToastMessage('회사 팔로우를 취소했습니다.');
            return;
          }

          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow/${companyFollowId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // 전역 상태에서 회사 팔로우 목록 업데이트
          setFollowCompany(followCompany.filter(id => id !== postData.companyId));
          setIsFollowing(false);
          setCompanyFollowId(null);
          showToastMessage('회사 팔로우를 취소했습니다.');
        } else if (postData.memberId) {
          // 개인 사용자 팔로우 취소 - memberFollowId가 없으면 전역 상태에서만 제거
          if (!memberFollowId) {
            // 전역 상태에서만 제거하고 API 호출하지 않음
            setFollowUser(followUser.filter(id => id !== postData.memberId));
            setIsFollowing(false);
            showToastMessage('사용자 팔로우를 취소했습니다.');
            return;
          }

          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/memberFollow/${memberFollowId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}) // 빈 객체를 body로 전송
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // 전역 상태에서 개인 사용자 팔로우 목록 업데이트
          setFollowUser(followUser.filter(id => id !== postData.memberId));
          setIsFollowing(false);
          setMemberFollowId(null);
          showToastMessage('사용자 팔로우를 취소했습니다.');
        }
      } else {
        // 팔로우 추가
        if (postData.companyId) {
          // 회사 팔로우 추가
          const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/companyFollow`, {
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
          
          // companyFollowId 저장
          if (result.data?.companyFollowId) {
            setCompanyFollowId(result.data.companyFollowId);
          }

          // 전역 상태에서 회사 팔로우 목록 업데이트
          setFollowCompany([...followCompany, postData.companyId]);
          setIsFollowing(true);
          showToastMessage('회사를 팔로우했습니다.');
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
          
          // memberFollowId 저장
          if (result.data?.memberFollowId) {
            setMemberFollowId(result.data.memberFollowId);
          }
          
          // 전역 상태에서 개인 사용자 팔로우 목록 업데이트
          setFollowUser([...followUser, postData.memberId]);
          setIsFollowing(true);
          showToastMessage('사용자를 팔로우했습니다.');
        }
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 팔로우 요청 실패:', err);
      showToastMessage('팔로우 요청에 실패했습니다.');
    }
  }, [isFollowing, postData, user?.memberId, followUser, followCompany, setFollowUser, setFollowCompany, memberFollowId, companyFollowId, showToastMessage]);

  // 스타 핸들러를 useCallback으로 메모이제이션
  const handleStar = useCallback(async () => {
    if (isStarLoading) return; // 이미 요청 중이면 무시
    
    if (!postData?.postId) {
      showToastMessage('게시글 정보를 찾을 수 없습니다.');
      return;
    }

    if (!user?.memberId) {
      showToastMessage('로그인이 필요합니다.');
      return;
    }

    setIsStarLoading(true);
    try {
      // 현재 스타 상태에 따라 API 요청 결정
      if (isStarred) {
        // 스타 취소 (DELETE 요청) - starId 사용
        if (!starId) {
          console.error('❌ [PostDetailPage] starId가 없습니다.');
          showToastMessage('스타 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star/${starId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer accessToken' // 실제 API에 맞게 Authorization 헤더 추가
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [PostDetailPage] 스타 취소 실패 - 응답:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // 스타 취소 성공
        setIsStarred(false);
        setStarId(null);
        // 전역 상태에서 스타 목록 업데이트
        setStarLst(starLst.filter(id => id !== postData.postId));
        showToastMessage('스타를 취소했습니다');
      } else {
        // 스타 추가 (POST 요청)
        const requestBody = {
          memberId: user.memberId,
          postId: postData.postId
        };

        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // TODO: 로그인 기능 완료 후 Authorization 헤더 추가
            // 'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [PostDetailPage] 스타 추가 실패 - 응답:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        
        // starId 저장
        if (result.data?.starId) {
          setStarId(result.data.starId);
        }
        
        // 스타 추가 성공
        setIsStarred(true);
        // 전역 상태에서 스타 목록 업데이트
        setStarLst([...starLst, postData.postId]);
        showToastMessage('스타했습니다');
      }

      // 게시글 정보 새로고침 (starCount 업데이트를 위해)
      const postResponse = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postData.postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (postResponse.ok) {
        const postResult = await postResponse.json();
        setPostData(prevData => prevData ? {
          ...prevData,
          starCount: postResult.data.starCount
        } : null);
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 스타 요청 실패:', err);
      showToastMessage('스타 요청에 실패했습니다.');
    } finally {
      setIsStarLoading(false);
    }
  }, [isStarLoading, postData?.postId, isStarred, starId, user?.memberId, starLst, setStarLst, showToastMessage]);

  // 댓글 추천 핸들러
  const handleCommentRecommend = useCallback(async (commentId: number) => {
    if (!user?.memberId) {
      showToastMessage('로그인이 필요합니다.');
      return;
    }

    // 이미 로딩 중이면 무시
    if (recommendLoading.get(commentId)) return;

    // 로딩 상태 설정
    setRecommendLoading(prev => new Map(prev).set(commentId, true));

    try {
      const isCurrentlyRecommended = userRecommendations.has(commentId);

      if (isCurrentlyRecommended) {
        // 추천 취소
        const recommendationId = userRecommendations.get(commentId);
        if (!recommendationId) {
          showToastMessage('추천 정보를 찾을 수 없습니다.');
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

        // 추천 취소 성공
        setUserRecommendations(prev => {
          const newMap = new Map(prev);
          newMap.delete(commentId);
          return newMap;
        });

        // 댓글 목록에서 추천 수 감소
        setComments(prev => prev.map(comment => 
          comment.commentId === commentId 
            ? { ...comment, recommendCount: Math.max(0, comment.recommendCount - 1) }
            : comment
        ));

        showToastMessage('추천을 취소했습니다.');
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
        
        // 추천 추가 성공
        if (result.data?.recommendationId) {
          setUserRecommendations(prev => {
            const newMap = new Map(prev);
            newMap.set(commentId, result.data.recommendationId);
            return newMap;
          });
        }

        // 댓글 목록에서 추천 수 증가
        setComments(prev => prev.map(comment => 
          comment.commentId === commentId 
            ? { ...comment, recommendCount: comment.recommendCount + 1 }
            : comment
        ));

        showToastMessage('댓글을 추천했습니다.');
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 댓글 추천 요청 실패:', err);
      showToastMessage('추천 요청에 실패했습니다.');
    } finally {
      // 로딩 상태 해제
      setRecommendLoading(prev => {
        const newMap = new Map(prev);
        newMap.delete(commentId);
        return newMap;
      });
    }
  }, [user?.memberId, userRecommendations, recommendLoading, showToastMessage]);

  // 공유 핸들러를 useCallback으로 메모이제이션
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      showToastMessage('링크 복사에 실패했습니다.');
    }
  }, [showToastMessage]);

  // 작성자 클릭 핸들러를 useCallback으로 메모이제이션
  const handleAuthorClick = useCallback(() => {
    if (!postData) {
      showToastMessage('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (postData.companyProfileUrl && postData.companyId) {
      navigate(`/company/${postData.companyId}`);
    } else if (postData.memberId) {
      navigate(`/member/${postData.memberId}`);
    } else {
      showToastMessage(postData.companyProfileUrl ? '회사 프로필 ID 정보가 없습니다.' : '개인 프로필 ID 정보가 없습니다.');
    }
  }, [postData, navigate, showToastMessage]);

  // 삭제 핸들러를 useCallback으로 메모이제이션
  const handleDelete = useCallback(async () => {
    if (!postData?.postId || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/posts/${postData.postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer accessToken' },
        body: JSON.stringify({})
      });

      if (response.ok && (await response.json()).status === 'SUCCESS') {
        showToastMessage('게시글이 삭제되었습니다.');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 게시글 삭제 실패:', err);
      showToastMessage('게시글 삭제에 실패했습니다.');
    }
  }, [postData?.postId, showToastMessage, navigate]);

  // 댓글 관련 함수들을 useCallback으로 메모이제이션
  const handleCommentChange = useCallback((text: string) => setCommentText(text), []);
  const handleLinkToggle = useCallback(() => setShowLinkInput(!showLinkInput), [showLinkInput]);
  const handleLinkChange = useCallback((url: string) => setLinkUrl(url), []);

  // 댓글 제출 핸들러를 useCallback으로 메모이제이션
  const handleCommentSubmit = useCallback(async () => {
    if (!commentText.trim()) {
      showToastMessage('댓글 내용을 입력해주세요.');
      return;
    }
    if (!postData?.postId) {
      showToastMessage('게시글 ID를 찾을 수 없습니다.');
      return;
    }
    
    // 로그인 확인
    const currentUserId = user?.memberId;
    if (!currentUserId || currentUserId <= 0) {
      showToastMessage('로그인이 필요합니다.');
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
          postId: postData.postId,
          memberId: currentUserId,
          content: commentText,
          link: linkUrl || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const created = await response.json();
      setComments((prev) => [...prev, created.data]);
      setCommentText('');
      setLinkUrl('');
      setShowLinkInput(false);
      showToastMessage('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      showToastMessage('댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  }, [commentText, postData?.postId, user?.memberId, linkUrl, showToastMessage]);

  // 날짜 포맷팅 함수를 useMemo로 메모이제이션
  const formatDate = useMemo(() => {
    return (dateString: string) => {
      const diffInMs = Date.now() - new Date(dateString).getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return '방금 전';
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      if (diffInDays < 7) return `${diffInDays}일 전`;
      
      return new Date(dateString).toLocaleDateString('ko-KR');
    };
  }, []);

  // 숫자 포맷팅 함수를 useMemo로 메모이제이션
  const formatNumber = useMemo(() => {
    return (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };
  }, []);

  // 마크다운 렌더링 함수를 useMemo로 메모이제이션
  const renderMarkdown = useMemo(() => {
    return (content: string) => content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/&lt;(strong|em|code|br)&gt;/g, '<$1>')
      .replace(/&lt;\/(strong|em|code)&gt;/g, '</$1>');
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
            <p className="text-gray-500">게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !postData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
            <span>목록으로</span>
          </Link>
        </div>
        
        <div className="text-center py-12">
          <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
          <p className="text-lg text-red-500 mb-2">오류가 발생했습니다</p>
          <p className="text-gray-500 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
          <Button 
            onClick={() => navigate('/home')}
            className="!rounded-button cursor-pointer whitespace-nowrap"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 뒤로가기 버튼 */}
      <PostHeader onBack={() => navigate('/home')} />

      {/* 상단 수정/삭제 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="!rounded-button cursor-pointer whitespace-nowrap"
          onClick={() => navigate(`/post/${postData.postId}/edit`, {
            state: {
              postData: {
                link: postData.link,
                title: postData.title,
                content: postData.content,
                tags: postData.tags,
                thumbnailUrl: postData.thumbnailUrl
              }
            }
          })}
        >
          <i className="fas fa-edit mr-2"></i>
          수정하기
        </Button>
        <Button
          variant="outline"
          className="!rounded-button cursor-pointer whitespace-nowrap text-red-600 hover:bg-red-50"
          onClick={handleDelete}
        >
          <i className="fas fa-trash-alt mr-2"></i>
          삭제하기
        </Button>
      </div>

      {/* 제목 섹션 */}
      <PostTitle 
        post={{
          ...postData,
          isStar: isStarred,
          tags: postData.tags || []
        }}
        onStarClick={handleStar}
      />

      {/* 작성자 정보 */}
      <AuthorInfo 
        post={postData}
        formatDate={formatDate}
        onFollowClick={handleFollow}
        onAuthorClick={handleAuthorClick}
        isFollowing={isFollowing}
      />

      {/* 본문 콘텐츠 */}
      <PostContent 
        post={{
          ...postData,
          content: renderMarkdown(postData.content)
        }}
        onStarClick={handleStar}
        onShareClick={handleShare}
      />

      {/* 베스트 댓글 */}
      <BestComments 
        comments={comments}
        bestCommentId={bestCommentId}
        formatDate={formatDate}
        formatNumber={formatNumber}
      />

      {/* 댓글 섹션 */}
      <CommentSection 
        comments={comments}
        commentCount={postData.commentCount}
        postId={postData.postId}
        memberProfileUrl={postData.memberProfileUrl}
        commentText={commentText}
        showLinkInput={showLinkInput}
        linkUrl={linkUrl}
        onCommentChange={handleCommentChange}
        onLinkToggle={handleLinkToggle}
        onLinkChange={handleLinkChange}
        onCommentSubmit={handleCommentSubmit}
        formatDate={formatDate}
        formatNumber={formatNumber}
        onCommentRecommend={handleCommentRecommend}
        userRecommendations={userRecommendations}
        recommendLoading={recommendLoading}
      />

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
