// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/foundation/button";
import { PostHeader } from "@/components/PostDetail/PostHeader";
import { PostTitle } from "@/components/PostDetail/PostTitle";
import { PostContent } from "@/components/PostDetail/PostContent";
import { AuthorInfo } from "@/components/PostDetail/AuthorInfo";
import { CommentSection } from "@/components/PostDetail/CommentSection";
import { BestComments } from "@/components/PostDetail/BestComments";
import { useUserStore } from "@/stores/userStore";
import { useAlertStore } from "@/stores/alertStore";
import { usePostDetail } from "@/hooks/posts/usePostDetail";
import { fetchMemberBadges, fetchAllBadges } from "@/api/mypage/badgeService";

/** 작성자의 대표 배지 정보를 가져오는 헬퍼 훅 (회사 글이면 빈 문자열) */
function useRepBadgeInfo(postData?: any) {
  const [badgeInfo, setBadgeInfo] = React.useState<{name: string, url: string}>({name: "", url: ""});

  React.useEffect(() => {
    let alive = true;

    async function run() {
      // 회사 글이면 배지 정보는 내려주지 않음(AuthorInfo에서 '기업' 표시)
      if (!postData?.memberId || postData?.companyId) {
        if (alive) setBadgeInfo({name: "", url: ""});
        return;
      }

      // 0) 글 응답에 배지 정보가 이미 실려있는 경우 우선 사용
      const inlineName =
        postData?.badgeName ||
        postData?.representativeBadgeName ||
        postData?.memberBadgeName ||
        postData?.repBadgeName;
      const inlineUrl = postData?.repBadgeUrl || postData?.badgeUrl;
      
      if (inlineName && typeof inlineName === "string" && inlineName.trim()) {
        if (alive) setBadgeInfo({name: inlineName.trim(), url: inlineUrl || ""});
        return;
      }

      try {
        // 1) API로 대표배지 찾기
        const [memberBadges, allBadges] = await Promise.all([
          fetchMemberBadges(postData.memberId),
          fetchAllBadges(),
        ]);

        // 2) 대표배지 판별(필드명 변형 최대한 커버)
        const rep = memberBadges.find((b: any) =>
          b?.isRepresentative === true ||
          b?.representative === true ||
          b?.representativeYn === "Y" ||
          b?.isRep === true ||
          b?.rep === true
        );

        if (!rep) {
          if (alive) setBadgeInfo({name: "", url: ""}); // 대표배지 미설정 ⇒ 표시 안 함
          return;
        }

        // 3) 메타에서 정보 매핑 (문자/숫자 혼용 방어)
        const meta = allBadges.find((m: any) => String(m.badgeId) === String(rep.badgeId));
        if (meta) {
          // 배지 이미지 매핑
          const badgeImages: Record<string, string> = {
            'ai_1.png': '/src/assets/images/ai_1.png',
            'amumu.png': '/src/assets/images/amumu.png',
            'aws_1.png': '/src/assets/images/aws_1.png',
            'db_1.png': '/src/assets/images/db_1.png',
            'fctmi_1.png': '/src/assets/images/fctmi_1.png',
            'first_article.png': '/src/assets/images/first_article.png',
            'first_comment.png': '/src/assets/images/first_comment.png',
            'followmany.png': '/src/assets/images/followmany.png',
            'helloworld.png': '/src/assets/images/helloworld.png',
            'like10.png': '/src/assets/images/like10.png',
            'like100.png': '/src/assets/images/like100.png',
            'like1000.png': '/src/assets/images/like1000.png',
            'paris.png': '/src/assets/images/paris.png',
            'react.png': '/src/assets/images/react.png',
            'spring.png': '/src/assets/images/spring.png',
            'star_5.png': '/src/assets/images/star_5.png',
            'star_13.png': '/src/assets/images/star_13.png',
            'star_42.png': '/src/assets/images/star_42.png',
            'view_50.png': '/src/assets/images/view1.png',
            'view_100.png': '/src/assets/images/view2.png',
            'view_1000.png': '/src/assets/images/view3.png',
            'locked.png': '/src/assets/images/locked.png',
          };
          
          const badgeImage = badgeImages[meta.badgeUrl] || '/fallback.png';
          if (alive) setBadgeInfo({name: (meta.name || "").trim(), url: badgeImage});
        }
      } catch (e) {
        if (alive) setBadgeInfo({name: "", url: ""}); // 실패해도 조용히 무시
      }
    }

    run();
    return () => { alive = false; };
  }, [postData?.memberId, postData?.companyId,
      postData?.badgeName, postData?.representativeBadgeName,
      postData?.memberBadgeName, postData?.repBadgeName,
      postData?.repBadgeUrl, postData?.badgeUrl]);

  return badgeInfo;
}

interface PostDetailPageProps {}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id, companyId } = useParams<{ id: string; companyId?: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { showSuccess, showError, showInfo } = useAlertStore();

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

  // ✅ 작성자 대표 배지 정보
  const authorBadgeInfo = useRepBadgeInfo(postData);

  // 공유 핸들러
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      showError('링크 복사에 실패했습니다.');
    }
  }, [showSuccess, showError]);

  // 작성자 클릭 핸들러
  const handleAuthorClick = useCallback(() => {
    if (!postData) {
      showError('게시글 정보를 찾을 수 없습니다.');
      return;
    }
    
    if (postData.companyProfileUrl && postData.companyId) {
      navigate(`/company/${postData.companyId}`);
    } else if (postData.memberId) {
      navigate(`/member/${postData.memberId}`);
    } else {
      showError(postData.companyProfileUrl ? '회사 프로필 ID 정보가 없습니다.' : '개인 프로필 ID 정보가 없습니다.');
    }
  }, [postData, navigate, showError]);

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
        showSuccess('게시글이 삭제되었습니다.');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ [PostDetailPage] 게시글 삭제 실패:', err);
      showError('게시글 삭제에 실패했습니다.');
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
        showFollowButton={
          // 1. 멤버ID가 현재 전역변수 ID와 같지 않음
          user?.memberId !== postData.memberId &&
          // 2. 상대방 멤버ID가 1이지만 companyId가 있음
          (postData.memberId !== 1 || (postData.memberId === 1 && postData.companyId !== null))
        }
        badgeImage={authorBadgeInfo.url}
        // ✅ 작성자 대표 배지 이름 전달 (회사 글이면 빈 문자열 전달)
        badgeName={postData.companyId ? "" : authorBadgeInfo.name}
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
