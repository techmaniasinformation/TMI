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
const PostDetailPage = () => {
  const {
    id,
    companyId
  } = useParams();
  const navigate = useNavigate();
  const {
    user
  } = useUserStore();

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer accessToken'
        },
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
    return dateString => {
      const utcDate = new Date(dateString);
      const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
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
    return num => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };
  }, []);

  // 마크다운 렌더링 함수
  const renderMarkdown = useMemo(() => {
    return content => content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code>$1</code>').replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&lt;(strong|em|code|br)&gt;/g, '<$1>').replace(/&lt;\/(strong|em|code)&gt;/g, '</$1>');
  }, []);

  // 로딩 상태
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-4xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center min-h-screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-spinner fa-spin text-4xl text-blue-500 dark:text-blue-400 mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 dark:text-gray-400"
    }, "\uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..."))));
  }

  // 에러 상태
  if (error || !postData) {
    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-4xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-6"
    }, /*#__PURE__*/React.createElement(Link, {
      to: "/home",
      className: "flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors cursor-pointer"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-left"
    }), /*#__PURE__*/React.createElement("span", null, "\uBAA9\uB85D\uC73C\uB85C"))), /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exclamation-triangle text-6xl text-red-300 dark:text-red-400 mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-lg text-red-500 dark:text-red-400 mb-2"
    }, "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-500 dark:text-gray-400 mb-4"
    }, error || '게시글을 찾을 수 없습니다.'), /*#__PURE__*/React.createElement(Button, {
      onClick: () => navigate('/home'),
      className: "!rounded-button cursor-pointer whitespace-nowrap"
    }, "\uBAA9\uB85D\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg"
  }, /*#__PURE__*/React.createElement(PostHeader, {
    onBack: () => navigate('/home')
  }), user?.memberId === postData.memberId && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "!rounded-button cursor-pointer whitespace-nowrap",
    onClick: () => navigate(`/post/${postData.postId}/edit`, {
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
    })
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit mr-2"
  }), "\uC218\uC815\uD558\uAE30"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "!rounded-button cursor-pointer whitespace-nowrap text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900",
    onClick: handleDelete
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt mr-2"
  }), "\uC0AD\uC81C\uD558\uAE30")), /*#__PURE__*/React.createElement(PostTitle, {
    post: {
      ...postData,
      isStar: isStarred,
      tags: postData.tags || []
    },
    onStarClick: user?.memberId === postData.memberId ? undefined : toggleStar,
    isStarLoading: isStarLoading,
    showStarButton: user?.memberId !== postData.memberId
  }), /*#__PURE__*/React.createElement(AuthorInfo, {
    post: postData,
    formatDate: formatDate,
    onFollowClick: toggleFollow,
    onAuthorClick: handleAuthorClick,
    isFollowing: isFollowing,
    showFollowButton:
    // 1. 멤버ID가 현재 전역변수 ID와 같지 않음
    user?.memberId !== postData.memberId && (
    // 2. 상대방 멤버ID가 1이지만 companyId가 있음
    postData.memberId !== 1 || postData.memberId === 1 && postData.companyId !== null)
  }), /*#__PURE__*/React.createElement(PostContent, {
    post: {
      ...postData,
      content: renderMarkdown(postData.content),
      isStar: isStarred
    },
    onStarClick: user?.memberId === postData.memberId ? undefined : toggleStar,
    onShareClick: handleShare,
    isStarLoading: isStarLoading,
    showStarButton: user?.memberId !== postData.memberId
  }), /*#__PURE__*/React.createElement(BestComments, {
    comments: comments,
    bestCommentId: bestCommentId,
    formatDate: formatDate,
    formatNumber: formatNumber,
    onCommentRecommend: toggleCommentRecommend,
    userRecommendations: userRecommendations,
    recommendLoading: recommendLoading
  }), /*#__PURE__*/React.createElement(CommentSection, {
    comments: comments,
    commentCount: postData.commentCount,
    postId: postData.postId,
    memberProfileUrl: user?.memberProfileUrl || '',
    commentText: commentText,
    showLinkInput: showLinkInput,
    linkUrl: linkUrl,
    onCommentChange: setCommentText,
    onLinkToggle: () => setShowLinkInput(!showLinkInput),
    onLinkChange: setLinkUrl,
    onCommentSubmit: addComment,
    formatDate: formatDate,
    formatNumber: formatNumber,
    onCommentRecommend: toggleCommentRecommend,
    userRecommendations: userRecommendations,
    recommendLoading: recommendLoading,
    deleteLoading: deleteLoading,
    onCommentDelete: deleteComment
  }));
};
export default PostDetailPage;