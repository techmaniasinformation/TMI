// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/foundation/button";
import { PostHeader } from "@/components/PostDetail/PostHeader";
import { PostTitle } from "@/components/PostDetail/PostTitle";
import { PostContent } from "@/components/PostDetail/PostContent";
import { AuthorInfo } from "@/components/PostDetail/AuthorInfo";
import { CommentSection } from "@/components/PostDetail/CommentSection";
import { BestComments } from "@/components/PostDetail/BestComments";
import { useAuth } from '@/hooks/store/useStoreActions';
import { usePostDetail } from "@/hooks/posts/usePostDetail";
import { usePostDetailActions } from "@/hooks/posts/usePostDetailActions";
import { usePostDetailUtils } from "@/hooks/posts/usePostDetailUtils";
import { usePostDetailUI } from "@/hooks/posts/usePostDetailUI";

interface PostDetailPageProps {}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id, companyId } = useParams<{ id: string; companyId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    deleteLoading,
    addComment,
    toggleCommentRecommend,
    deleteComment
  } = usePostDetail(id || '', companyId);

  // 분리된 커스텀 훅들 사용
  const { handleShare, handleAuthorClick, handleDelete, handleEdit } = usePostDetailActions(postData);
  const { formatDate, formatNumber, renderMarkdown } = usePostDetailUtils();
  const { isAuthor, showFollowButton, showStarButton } = usePostDetailUI(postData);

  // 로딩 상태
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-500 dark:text-blue-400 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400">게시글을 불러오는 중...</p>
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
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>
            <span>목록으로</span>
          </Link>
        </div>
        
        <div className="text-center py-12">
          <i className="fas fa-exclamation-triangle text-6xl text-red-300 dark:text-red-400 mb-4"></i>
          <p className="text-lg text-red-500 dark:text-red-400 mb-2">오류가 발생했습니다</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
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
    <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg">
      {/* 뒤로가기 버튼 */}
      <PostHeader onBack={() => navigate('/home')} />

      {/* 상단 수정/삭제 버튼 - 작성자만 보임 */}
      {isAuthor && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap"
            onClick={handleEdit}
          >
            <i className="fas fa-edit mr-2"></i>
            수정하기
          </Button>
          <Button
            variant="outline"
            className="!rounded-button cursor-pointer whitespace-nowrap text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
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
        onStarClick={isAuthor ? undefined : toggleStar}
        isStarLoading={isStarLoading}
        showStarButton={showStarButton}
      />

      {/* 작성자 정보 */}
      <AuthorInfo 
        post={postData}
        formatDate={formatDate}
        onFollowClick={toggleFollow}
        onAuthorClick={handleAuthorClick}
        isFollowing={isFollowing}
        showFollowButton={showFollowButton}
      />

      {/* 본문 콘텐츠 */}
      <PostContent 
        post={{
          ...postData,
          content: renderMarkdown(postData.content),
          isStar: isStarred
        }}
        onStarClick={isAuthor ? undefined : toggleStar}
        onShareClick={handleShare}
        isStarLoading={isStarLoading}
        showStarButton={showStarButton}
      />

      {/* 베스트 댓글 */}
      <BestComments 
        comments={comments}
        bestCommentId={bestCommentId}
        formatDate={formatDate}
        formatNumber={formatNumber}
        onCommentRecommend={toggleCommentRecommend}
        userRecommendations={userRecommendations}
        recommendLoading={recommendLoading}
      />

      {/* 댓글 섹션 */}
      <CommentSection 
        comments={comments}
        commentCount={postData.commentCount}
        postId={postData.postId}
        memberProfileUrl={user?.memberProfileUrl || ''}
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
        deleteLoading={deleteLoading}
        onCommentDelete={deleteComment}
      />
    </div>
  );
};

export default PostDetailPage;
