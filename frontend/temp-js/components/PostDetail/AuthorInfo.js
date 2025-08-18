import React, { useMemo } from 'react';
import UserInfoBox from '@/components/domain/article/UserInfo';
import { Badge } from '@/components/domain/Badge';
import { Button } from '@/components/foundation/button';
import { DateTimeComponent, CardInfoCount } from '@/components/domain/article';
export const AuthorInfo = ({
  post,
  formatDate,
  onFollowClick,
  onAuthorClick,
  isFollowing,
  showFollowButton = true
}) => {
  // 프로필 이미지 URL을 메모이제이션
  const profileImageUrl = useMemo(() => {
    return post.memberProfileUrl;
  }, [post.memberProfileUrl]);
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-md dark:shadow-lg p-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(UserInfoBox, {
    profileImageUrl: profileImageUrl,
    nickname: post.name,
    imageSize: "64px",
    onClick: onAuthorClick,
    badge: /*#__PURE__*/React.createElement(Badge, {
      className: "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium"
    }, "\uC778\uC99D")
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-4"
  }, /*#__PURE__*/React.createElement(DateTimeComponent, {
    date: post.createAt,
    formatDate: formatDate
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 dark:text-gray-500"
  }, "\u2022"), /*#__PURE__*/React.createElement(CardInfoCount, {
    viewCount: post.viewCount,
    starCount: post.starCount,
    commentCount: post.commentCount,
    showStar: true,
    showComment: true,
    showView: true
  }))), showFollowButton && /*#__PURE__*/React.createElement(Button, {
    variant: isFollowing ? "dark" : "primary",
    size: "sm",
    onClick: onFollowClick
  }, isFollowing ? '팔로우 취소' : '팔로우')));
};