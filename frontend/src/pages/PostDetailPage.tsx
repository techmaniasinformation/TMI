// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/foundation/button";
import { PostHeader } from "@/components/PostDetail/PostHeader";
import { PostTitle } from "@/components/PostDetail/PostTitle";
import { PostContent } from "@/components/PostDetail/PostContent";
import { AuthorInfo } from "@/components/PostDetail/AuthorInfo";
import { CommentSection } from "@/components/PostDetail/CommentSection";
import { BestComments } from "@/components/PostDetail/BestComments";

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

  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 게시글 데이터 상태
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [bestCommentId, setBestCommentId] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

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
        
        console.log('🔍 [PostDetailPage] 게시글 상세 정보 가져오기 시작:', id);
        
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
        
        console.log('✅ [PostDetailPage] 게시글 상세 정보 가져오기 완료:', data);
        
        setPostData(data.data);
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
  const fetchComments = async () => {
    if (!postData) return;

    try {
      setCommentLoading(true);
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment?postId=${postData.postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data: CommentResponse = await response.json();
        setComments(data.data?.comments || []);
        setBestCommentId(data.data?.bestCommentId || -1);
      } else {
        console.error('댓글 목록 가져오기 실패');
        setComments([]);
        setBestCommentId(-1);
      }
    } catch (error) {
      console.error('댓글 목록 가져오기 오류:', error);
      setComments([]);
      setBestCommentId(-1);
    } finally {
      setCommentLoading(false);
    }
  };

  // 게시글 데이터가 로드되면 댓글도 가져오기
  useEffect(() => {
    if (postData) {
      fetchComments();
    }
  }, [postData]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showToastMessage(isFollowing ? '팔로우를 취소했습니다.' : '팔로우했습니다.');
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    showToastMessage(isStarred ? '스타를 취소했습니다.' : '스타를 눌렀습니다.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postData?.title || 'TMI 게시글',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToastMessage('링크가 클립보드에 복사되었습니다.');
    }
  };

  // 댓글 관련 핸들러들
  const handleCommentChange = (text: string) => {
    setCommentText(text);
  };

  const handleLinkToggle = () => {
    setShowLinkInput(!showLinkInput);
  };

  const handleLinkChange = (url: string) => {
    setLinkUrl(url);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postData) {
      showToastMessage('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const commentData = {
        memberId: 1, // TODO: 임시로 1로 설정, 추후 실제 로그인된 사용자 ID로 변경 필요
        postId: postData.postId, // URL 파라미터에서 가져온 postId 사용
        comment: commentText.trim(),
        ...(linkUrl.trim() && { link: linkUrl.trim() })
      };

      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 실제 인증 토큰이 있다면 추가
          // 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        showToastMessage('댓글이 등록되었습니다.');
        setCommentText('');
        setLinkUrl('');
        setShowLinkInput(false);
        
        // 댓글 목록 새로고침
        await fetchComments();
        
        // 게시글 정보 새로고침 (commentCount 업데이트를 위해)
        const postResponse = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postData.postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (postResponse.ok) {
          const postData: PostDetailResponse = await postResponse.json();
          setPostData(postData.data);
        }
      } else {
        showToastMessage('댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 등록 오류:', error);
      showToastMessage('댓글 등록에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderMarkdown = (content: string) => {
    // 간단한 마크다운 렌더링 (필요시 확장)
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

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
        <Link to={`/post/${postData.postId}/edit`}>
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-edit mr-2"></i>
            수정하기
          </Button>
        </Link>
        <Button
          variant="outline"
          className="!rounded-button cursor-pointer whitespace-nowrap text-red-600 hover:bg-red-50"
        >
          <i className="fas fa-trash-alt mr-2"></i>
          삭제하기
        </Button>
      </div>

      {/* 제목 섹션 */}
      <PostTitle 
        post={{
          ...postData,
          isStar: isStarred
        }}
        onStarClick={handleStar}
      />

      {/* 작성자 정보 */}
      <AuthorInfo 
        post={postData}
        formatDate={formatDate}
        onFollowClick={handleFollow}
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
        formatDate={formatDate}
        formatNumber={formatNumber}
      />

      {/* 댓글 섹션 */}
      <CommentSection
        comments={comments}
        commentCount={postData.commentCount}
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
