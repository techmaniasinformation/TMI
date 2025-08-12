// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useMemo } from 'react';
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
  const { user, memberId } = useUserStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);
  const [starId, setStarId] = useState<number | null>(null);

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

  // 게시글 데이터 상태
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
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
      } catch (err) {
        console.error('❌ [PostDetailPage] 게시글 상세 정보 가져오기 실패:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
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
    };

    fetchComments();
  }, [postData?.postId]);



  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showToastMessage(isFollowing ? '팔로우를 취소했습니다.' : '팔로우했습니다.');
  };

  const handleStar = async () => {
    if (isStarLoading) return; // 이미 요청 중이면 무시
    
    if (!postData?.postId) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }

    setIsStarLoading(true);
    try {
      // 현재 스타 상태에 따라 API 요청 결정
      if (isStarred) {
        // 스타 취소 (DELETE 요청) - starId 사용
        if (!starId) {
          console.error('❌ [PostDetailPage] starId가 없습니다.');
          alert('스타 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star/${starId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // TODO: 로그인 기능 완료 후 Authorization 헤더 추가
            // 'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({}) // 빈 객체를 body로 전송
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [PostDetailPage] 스타 취소 실패 - 응답:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // DELETE 요청은 응답 본문이 없을 수 있으므로 확인
        let result;
        try {
          const responseText = await response.text();
          if (responseText) {
            result = JSON.parse(responseText);
          } else {
            result = { success: true };
          }
        } catch (parseError) {
          result = { success: true };
        }

        showToastMessage('스타를 취소했습니다');
      } else {
        // 스타 추가 (POST 요청)
        const requestBody = {
          memberId: 1, // 임시로 1로 설정 (로그인 기능 완료 후 실제 memberId로 변경)
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // starId 저장
        if (result.data?.starId) {
          setStarId(result.data.starId);
        }
        
        showToastMessage('스타했습니다');
      }

      // 스타 상태 토글
      setIsStarred(!isStarred);
      
      // 스타 취소 시 starId 초기화
      if (isStarred) {
        setStarId(null);
      }

      // 게시글 정보 새로고침 (starCount 업데이트를 위해)
      const postResponse = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postData.postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        setPostData(postData.data);
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 스타 요청 실패:', err);
      alert('스타 요청에 실패했습니다.');
    } finally {
      setIsStarLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      showToastMessage('링크 복사에 실패했습니다.');
    }
  };

  const handleAuthorClick = () => {
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
  };

  const handleDelete = async () => {
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
  };

  // 댓글 관련 함수들
  const handleCommentChange = (text: string) => setCommentText(text);
  const handleLinkToggle = () => setShowLinkInput(!showLinkInput);
  const handleLinkChange = (url: string) => setLinkUrl(url);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!postData?.postId) {
      alert('게시글 ID를 찾을 수 없습니다.');
      return;
    }
    
    // 로그인 확인
    const currentUserId = user?.memberId ?? memberId;
    if (!currentUserId || currentUserId <= 0) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

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
          content: newComment,
          link: linkUrl || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const created = await response.json();
      setComments((prev) => [...prev, created.data]);
      setNewComment('');
      setLinkUrl('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };



  const formatDate = (dateString: string) => {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderMarkdown = (content: string) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/&lt;(strong|em|code|br)&gt;/g, '<$1>')
    .replace(/&lt;\/(strong|em|code)&gt;/g, '</$1>');

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
