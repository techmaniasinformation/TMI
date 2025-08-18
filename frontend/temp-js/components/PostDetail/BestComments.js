import React from 'react';
import { getSafeProfileUrl, getSafeBadgeUrl, handleProfileImageError } from '@/utils/defaultImages';
export const BestComments = ({
  comments,
  bestCommentId,
  formatDate,
  formatNumber,
  onCommentRecommend,
  userRecommendations,
  recommendLoading
}) => {
  // 베스트 댓글 ID가 유효한지 확인 (-1, null, undefined가 아닌 경우)
  if (!bestCommentId || bestCommentId <= 0) {
    return null;
  }

  // 베스트 댓글 찾기
  const bestComment = comments.find(comment => comment.commentId === bestCommentId);

  // 베스트 댓글이 없으면 표시하지 않음
  if (!bestComment) {
    return null;
  }

  // 안전한 프로필 이미지 URL 사용
  const safeBestCommentProfileUrl = getSafeProfileUrl(bestComment.memberProfileUrl);
  const safeBestCommentBadgeUrl = getSafeBadgeUrl(bestComment.badgeUrl);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-yellow-50 dark:from-gray-800 to-orange-50 dark:to-gray-900 border border-yellow-200 dark:border-gray-700 rounded-lg p-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-600 dark:text-yellow-400 font-semibold"
  }, "\u2B50 \uBCA0\uC2A4\uD2B8 \uB313\uAE00"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, "\uAC00\uC7A5 \uB9CE\uC740 \uCD94\uCC9C\uC744 \uBC1B\uC740 \uB313\uAE00\uC785\uB2C8\uB2E4")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: safeBestCommentProfileUrl,
    alt: "\uD504\uB85C\uD544",
    className: "w-12 h-12 rounded-full object-cover",
    onError: handleProfileImageError
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-sm dark:text-white"
  }, bestComment.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 dark:text-gray-400 text-xs"
  }, formatDate(bestComment.createAt))), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 dark:text-gray-200 mb-2 break-words break-all"
  }, bestComment.comment), bestComment.link && /*#__PURE__*/React.createElement("a", {
    href: bestComment.link,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-600 hover:text-blue-800 text-sm break-all"
  }, bestComment.link), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-sm text-gray-500 mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onCommentRecommend(bestComment.commentId),
    className: `flex items-center gap-1 ${userRecommendations.has(bestComment.commentId) ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`,
    disabled: recommendLoading.has(bestComment.commentId)
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC4D"), /*#__PURE__*/React.createElement("span", null, userRecommendations.has(bestComment.commentId) ? '추천됨' : '추천'), /*#__PURE__*/React.createElement("span", {
    className: "ml-1 font-medium text-yellow-600"
  }, formatNumber(bestComment.recommendCount)))))));
};