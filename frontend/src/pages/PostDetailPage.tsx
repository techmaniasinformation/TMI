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

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const [isFollowing, setIsFollowing] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarLoading, setIsStarLoading] = useState(false);
  const [starId, setStarId] = useState<number | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 댓글 관련 상태
  const [comments, setComments] = useState<any[]>([]);
  const [bestCommentId, setBestCommentId] = useState<number>(-1);
  const [commentText, setCommentText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

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
  useEffect(() => {
    const fetchComments = async () => {
      if (!postData?.postId) return;

      try {
        console.log('🔍 [PostDetailPage] 댓글 목록 가져오기 시작:', postData.postId);
        
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
        console.log('✅ [PostDetailPage] 댓글 목록 가져오기 완료:', data);
        
        setComments(data.data?.comments || []);
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
    showToastMessage(isFollowing ? '팔로우를 취소했습니다' : '팔로우했습니다');
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

        console.log('⭐ [PostDetailPage] 스타 취소 요청 (starId):', starId);

        const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/star/${starId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // TODO: 로그인 기능 완료 후 Authorization 헤더 추가
            // 'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({}) // 빈 객체를 body로 전송
        });

        console.log('🔍 [PostDetailPage] 스타 취소 응답 상태:', response.status);

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

        console.log('✅ [PostDetailPage] 스타 취소 성공:', result);
        showToastMessage('스타를 취소했습니다');
      } else {
        // 스타 추가 (POST 요청)
        const requestBody = {
          memberId: 1, // 임시로 1로 설정 (로그인 기능 완료 후 실제 memberId로 변경)
          postId: postData.postId
        };

        console.log('⭐ [PostDetailPage] 스타 추가 요청:', requestBody);

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
        console.log('✅ [PostDetailPage] 스타 추가 성공:', result);
        
        // starId 저장
        if (result.data?.starId) {
          setStarId(result.data.starId);
          console.log('💾 [PostDetailPage] starId 저장:', result.data.starId);
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



  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToastMessage('링크가 복사되었습니다');
  };

  // 댓글 관련 함수들
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
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!postData?.postId) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const requestBody: any = {
        memberId: 1, // 임시로 1로 설정 (로그인 기능 완료 후 실제 memberId로 변경)
        postId: postData.postId,
        comment: commentText.trim()
      };

      // link가 있을 때만 추가
      if (showLinkInput && linkUrl.trim()) {
        requestBody.link = linkUrl.trim();
      }

      console.log('📝 [PostDetailPage] 댓글 작성 요청:', requestBody);

      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment`, {
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
      console.log('✅ [PostDetailPage] 댓글 작성 성공:', result);

      // 댓글 작성 성공 후 댓글 목록과 게시글 정보 새로고침
      if (postData.postId) {
        // 댓글 목록 새로고침
        const commentsResponse = await fetch(`https://i13a509.p.ssafy.io/api/v1/comment?postId=${postData.postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.data.comments || []);
          setBestCommentId(commentsData.data.bestCommentId || -1);
        }

        // 게시글 정보 새로고침 (commentCount 업데이트를 위해)
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
      }

      // 폼 초기화
      setCommentText('');
      setLinkUrl('');
      setShowLinkInput(false);
      showToastMessage('댓글이 등록되었습니다');
    } catch (err) {
      console.error('❌ [PostDetailPage] 댓글 작성 실패:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-gray-700 mb-3 mt-4">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-600 mb-2 ml-4">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-600 mb-4 leading-relaxed">{line}</p>;
    });
  };

  // 로딩 상태
  if (loading) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">게시글을 불러오는 중...</p>
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
        bestCommentId={bestCommentId}
        formatDate={formatDate}
        formatNumber={formatNumber}
      />

      {/* 댓글 섹션 */}
      <CommentSection 
        comments={comments}
        commentCount={postData.commentCount}
        postId={postData.postId}
        memberProfileUrl="https://via.placeholder.com/40x40/cccccc/666666?text=U"
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
