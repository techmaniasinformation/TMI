import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePostDetail } from '@/hooks/posts/usePostDetail';
import { PostHeader } from '@/components/PostDetail/PostHeader';
import { PostTitle } from '@/components/PostDetail/PostTitle';
import { PostContent } from '@/components/PostDetail/PostContent';
import { AuthorInfo } from '@/components/PostDetail/AuthorInfo';
import { BestComments } from '@/components/PostDetail/BestComments';
import { CommentSection } from '@/components/PostDetail/CommentSection';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { post, loading, error, formatDate, formatNumber } = usePostDetail(id || '');
  const [commentText, setCommentText] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // 모든 핸들러들을 여기서 정의
  const handleBack = () => window.history.back();
  const handleStarClick = () => {
    // TODO: 스타 토글 로직 구현
    console.log('스타 토글');
  };
  const handleFollowClick = () => {
    // TODO: 팔로우 로직 구현
    console.log('팔로우 토글');
  };
  const handleShareClick = () => {
    // TODO: 공유 로직 구현
    console.log('공유하기');
  };
  const handleCommentSubmit = () => {
    // TODO: 댓글 등록 로직 구현
    console.log('댓글 제출:', { commentText, linkUrl });
    setCommentText('');
    setLinkUrl('');
    setShowLinkInput(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-32 bg-gray-200 rounded mb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                게시글을 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 mb-6">
                {error || '요청하신 게시글이 존재하지 않습니다.'}
              </p>
              <button 
                onClick={handleBack}
                className="px-4 py-2 bg-prime-btn text-white rounded-md hover:bg-prime-btn-hover transition-colors"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          <PostHeader onBack={handleBack} />
          
          <PostTitle 
            post={post}
            onStarClick={handleStarClick}
          />
          
          <AuthorInfo 
            post={post}
            formatDate={formatDate}
            onFollowClick={handleFollowClick}
          />
          
          <PostContent 
            post={post}
            onStarClick={handleStarClick}
            onShareClick={handleShareClick}
          />
          
          <BestComments 
            comments={post.comments}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />
          
          <CommentSection 
            comments={post.comments}
            commentCount={post.commentCount}
            memberProfileUrl={post.memberProfileUrl}
            commentText={commentText}
            showLinkInput={showLinkInput}
            linkUrl={linkUrl}
            onCommentChange={setCommentText}
            onLinkToggle={() => setShowLinkInput(!showLinkInput)}
            onLinkChange={setLinkUrl}
            onCommentSubmit={handleCommentSubmit}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />
          
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
