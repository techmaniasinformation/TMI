// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/foundation/button";
import { PostHeader } from "@/components/PostDetail/PostHeader";
import { PostTitle } from "@/components/PostDetail/PostTitle";
import { PostContent } from "@/components/PostDetail/PostContent";
import { AuthorInfo } from "@/components/PostDetail/AuthorInfo";
import { CommentSection } from "@/components/PostDetail/CommentSection";
import { BestComments } from "@/components/PostDetail/BestComments";
import { useUserStore } from "@/stores/userStore";
import { usePostDetail } from "@/hooks/posts/usePostDetail";

interface PostDetailPageProps {}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // 커스텀 훅 사용
  const {
    postData,
    loading,
    error,
    isStarred,
    isStarLoading,
    toggleStar,
    isFollowing,
    toggleFollow,
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
  } = usePostDetail(id || '');

  // 공유 핸들러
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  }, []);

  // 작성자 클릭 핸들러
  const handleAuthorClick = useCallback(() => {
    if (!postData) {
      alert('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (postData.companyProfileUrl && postData.companyId) {
      navigate(`/company/${postData.companyId}`);
    } else if (postData.memberId) {
      navigate(`/member/${postData.memberId}`);
    } else {
      alert(postData.companyProfileUrl ? '회사 프로필 ID 정보가 없습니다.' : '개인 프로필 ID 정보가 없습니다.');
    }
  }, [postData, navigate]);

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!postData?.postId || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`https://i13a509.p.ssafy.io/api/v1/post/${postData.postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer accessToken' },
        body: JSON.stringify({})
      });

      if (response.ok && (await response.json()).status === 'SUCCESS') {
        alert('게시글이 삭제되었습니다.');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  }, [postData?.postId, navigate]);

  // 날짜 포맷팅 함수
  const formatDate = useMemo(() => {
    return (dateString: string) => {
      const utcDate = new Date(dateString);
      const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
      
      const diffInMs = Date.now() - kstDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return '방금 전';
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInHours < 24) return `${diffInHours}시간 전`;
      if (diffInDays < 7) return `${diffInDays}일 전`;
      
      return kstDate.toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul'
      });
    };
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = useMemo(() => {
    return (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };
  }, []);

  // 마크다운 렌더링 함수
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

      {/* 상단 수정/삭제 버튼 - 작성자만 보임 */}
      {user?.memberId === postData.memberId && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap"
            onClick={() => navigate(`/post/${postData.postId}/edit`, {
              state: {
                postData: {
                  postId: postData.postId,
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
      )}

      {/* 제목 섹션 */}
      <PostTitle 
        post={{
          ...postData,
          isStar: isStarred,
          tags: postData.tags || []
        }}
        onStarClick={user?.memberId === postData.memberId ? undefined : toggleStar}
        isStarLoading={isStarLoading}
        showStarButton={user?.memberId !== postData.memberId}
      />

      {/* 작성자 정보 */}
      <AuthorInfo 
        post={postData}
        formatDate={formatDate}
        onFollowClick={toggleFollow}
        onAuthorClick={handleAuthorClick}
        isFollowing={isFollowing}
        showFollowButton={postData.memberId !== 1}
      />

      {/* 본문 콘텐츠 */}
      <PostContent 
        post={{
          ...postData,
          content: renderMarkdown(postData.content),
          isStar: isStarred
        }}
        onStarClick={user?.memberId === postData.memberId ? undefined : toggleStar}
        onShareClick={handleShare}
        isStarLoading={isStarLoading}
        showStarButton={user?.memberId !== postData.memberId}
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
        memberProfileUrl={user?.memberProfileUrl || postData.memberProfileUrl}
        commentText={commentText}
        showLinkInput={showLinkInput}
        linkUrl={linkUrl}
        onCommentChange={setCommentText}
        onLinkToggle={() => setShowLinkInput(!showLinkInput)}
        onLinkChange={setLinkUrl}
        onCommentSubmit={addComment}
        formatDate={formatDate}
        formatNumber={formatNumber}
        onCommentRecommend={toggleCommentRecommend}
        userRecommendations={userRecommendations}
        recommendLoading={recommendLoading}
      />
    </div>
  );
};

export default PostDetailPage;
