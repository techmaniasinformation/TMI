import React, { useMemo, useState } from 'react';
import { Button } from '@/components/foundation/button';
import { getSafeProfileUrl, getSafeBadgeUrl, handleProfileImageError } from '@/utils/defaultImages';
import { useUserStore } from '@/stores/userStore';
export const CommentSection = ({
  comments,
  commentCount,
  postId,
  memberProfileUrl,
  commentText,
  showLinkInput,
  linkUrl,
  onCommentChange,
  onLinkToggle,
  onLinkChange,
  onCommentSubmit,
  formatDate,
  formatNumber,
  onCommentRecommend,
  userRecommendations,
  recommendLoading,
  deleteLoading,
  onCommentDelete
}) => {
  // 전역 사용자 정보 가져오기 (닉네임 비교용)
  const {
    user
  } = useUserStore();

  // URL 검증을 위한 상태 추가
  const [urlError, setUrlError] = useState('');

  // URL 검증 함수
  const processAndValidateUrl = url => {
    setUrlError('');
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    try {
      const urlObj = new URL(processedUrl);
      if (!urlObj.protocol || !urlObj.protocol.startsWith('http')) {
        setUrlError('http 또는 https URL을 입력해주세요.');
        return null;
      }
      const hostname = urlObj.hostname.toLowerCase();
      if (!hostname.includes('tistory.com') && !hostname.includes('velog.io') && !hostname.includes('blog.naver.com') && !hostname.includes('medium.com')) {
        setUrlError('티스토리(tistory.com), 벨로그(velog.io), 네이버 블로그(blog.naver.com), Medium(medium.com) 링크만 허용됩니다.');
        return null;
      }
      return processedUrl;
    } catch (error) {
      setUrlError('올바른 URL 형식을 입력해주세요.');
      return null;
    }
  };

  // 링크 변경 핸들러
  const handleLinkChange = url => {
    onLinkChange(url);
    if (url.trim()) {
      processAndValidateUrl(url);
    } else {
      setUrlError('');
    }
  };

  // 안전한 프로필 이미지 URL을 메모이제이션
  const safeMemberProfileUrl = useMemo(() => {
    return getSafeProfileUrl(memberProfileUrl);
  }, [memberProfileUrl]);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-4 dark:text-white"
  }, "\uB313\uAE00 \uC791\uC131"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: safeMemberProfileUrl,
    alt: "\uD504\uB85C\uD544",
    className: "w-10 h-10 rounded-full object-cover",
    onError: handleProfileImageError
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: commentText,
    onChange: e => onCommentChange(e.target.value),
    placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...",
    className: "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800",
    rows: 3,
    maxLength: 200
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, commentText.length, "/200")), showLinkInput && /*#__PURE__*/React.createElement("div", {
    className: "relative mt-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "url",
    value: linkUrl,
    onChange: e => handleLinkChange(e.target.value),
    maxLength: 255,
    placeholder: "\uB9C1\uD06C URL\uC744 \uC785\uB825\uD558\uC138\uC694 (\uC120\uD0DD\uC0AC\uD56D)",
    className: "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  }), urlError && /*#__PURE__*/React.createElement("p", {
    className: "text-red-500 dark:text-red-400 text-xs mt-1"
  }, urlError), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-2 top-2 text-xs text-gray-500 dark:text-gray-400"
  }, linkUrl.length, "/255")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLinkToggle,
    className: "text-blue-600 hover:text-blue-800 text-sm"
  }, showLinkInput ? '링크 제거' : '링크 추가'), /*#__PURE__*/React.createElement(Button, {
    onClick: onCommentSubmit,
    className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  }, "\uB313\uAE00 \uC791\uC131"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-4 dark:text-white"
  }, "\uB313\uAE00 ", formatNumber(commentCount)), comments.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400 text-center py-8"
  }, "\uC544\uC9C1 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, comments.map(comment => {
    // 각 댓글의 안전한 프로필 이미지 URL을 직접 계산
    const safeCommentProfileUrl = getSafeProfileUrl(comment.memberProfileUrl);
    const safeCommentBadgeUrl = getSafeBadgeUrl(comment.badgeUrl);
    return /*#__PURE__*/React.createElement("div", {
      key: comment.commentId,
      className: "border-b border-gray-200 dark:border-gray-700 pb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: safeCommentProfileUrl,
      alt: "\uD504\uB85C\uD544",
      className: "w-10 h-10 rounded-full object-cover",
      onError: handleProfileImageError
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-sm dark:text-white"
    }, comment.name), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-500 dark:text-gray-400 text-xs"
    }, formatDate(comment.createAt))), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-700 dark:text-gray-200 mb-2 break-words break-all"
    }, comment.comment), comment.link && /*#__PURE__*/React.createElement("a", {
      href: comment.link,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-blue-600 hover:text-blue-800 text-sm break-all"
    }, comment.link), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 mt-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onCommentRecommend(comment.commentId),
      className: `flex items-center gap-1 text-sm ${userRecommendations.has(comment.commentId) ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`,
      disabled: recommendLoading.has(comment.commentId)
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC4D"), /*#__PURE__*/React.createElement("span", null, userRecommendations.has(comment.commentId) ? '추천됨' : '추천'), /*#__PURE__*/React.createElement("span", {
      className: "ml-1 font-medium text-yellow-600"
    }, formatNumber(comment.recommendCount || 0))), user?.nickname && comment.name === user.nickname && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
          onCommentDelete(comment.commentId);
        }
      },
      disabled: deleteLoading.has(comment.commentId),
      className: `flex items-center gap-1 text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 ${deleteLoading.has(comment.commentId) ? 'opacity-50 cursor-not-allowed' : ''}`
    }, deleteLoading.has(comment.commentId) ? /*#__PURE__*/React.createElement("span", null, "\uC0AD\uC81C \uC911...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDDD1\uFE0F"), /*#__PURE__*/React.createElement("span", null, "\uC0AD\uC81C")))))));
  }))));
};