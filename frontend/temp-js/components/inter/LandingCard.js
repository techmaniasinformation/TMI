import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import Tag from '@/components/domain/article/Tag';
import CardInfoCount from '@/components/domain/article/CardInfoCount';
import { getSafeProfileUrl, getSafeBadgeUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

// 카드 variant 스타일 정의
const cardVariants = cva('backdrop-blur-sm transition-all duration-300 cursor-pointer rounded-lg border hover:shadow-lg', {
  variants: {
    variant: {
      default: 'bg-light-bg text-dark-bg border border-dark-bg hover:bg-light-bg-hover',
      dark: 'bg-dark-bg text-white border border-light-bg hover:bg-dark-bg-hover',
      light: 'bg-light-bg text-dark-bg border border-dark-bg hover:bg-light-bg-hover'
    }
  },
  defaultVariants: {
    variant: 'light'
  }
});
const LandingCard = ({
  postId,
  memberProfile,
  companyProfileUrl,
  name,
  badgeUrl,
  title,
  createAt,
  viewCount,
  starCount,
  commentCount,
  tags,
  thumbnailUrl,
  roleColor,
  hoverBorder,
  hoverShadow,
  variant,
  onClick
}) => {
  // 이미지 에러 상태 관리
  const [profileImageError, setProfileImageError] = useState(false);
  const [badgeImageError, setBadgeImageError] = useState(false);
  const [thumbnailImageError, setThumbnailImageError] = useState(false);

  // 안전한 이미지 URL 사용
  const safeProfileUrl = (memberProfile || companyProfileUrl) === 'default.png' ? DEFAULT_IMAGES.PROFILE : getSafeProfileUrl(memberProfile || companyProfileUrl);
  const safeBadgeUrl = getSafeBadgeUrl(badgeUrl);
  return /*#__PURE__*/React.createElement("div", {
    key: postId,
    className: cn(cardVariants({
      variant
    }),
    // ***** 다크/라이트에 따라 클래스 적용
    hoverBorder, hoverShadow),
    onClick: onClick // ******** 클릭 이벤트 바인딩 ********
    ,
    role: "button",
    tabIndex: 0,
    onKeyPress: e => {
      if (e.key === 'Enter' && onClick) {
        onClick();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-4"
  }, memberProfile || companyProfileUrl ? /*#__PURE__*/React.createElement("img", {
    src: safeProfileUrl,
    alt: `${name} 프로필`,
    className: "w-8 h-8 rounded-full object-cover",
    onError: () => setProfileImageError(true)
  }) : /*#__PURE__*/React.createElement("img", {
    src: DEFAULT_IMAGES.PROFILE,
    alt: "Default Profile",
    className: "w-8 h-8 rounded-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, name), badgeUrl && !badgeImageError ? /*#__PURE__*/React.createElement("img", {
    src: safeBadgeUrl,
    alt: "Badge",
    className: "w-5 h-5 rounded-full border",
    onError: () => setBadgeImageError(true)
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-20 flex-shrink-0 ml-auto"
  }, thumbnailUrl && thumbnailUrl.trim() !== '' && !thumbnailImageError ? /*#__PURE__*/React.createElement("img", {
    src: thumbnailUrl,
    alt: `${title} 썸네일`,
    className: "w-full h-full object-cover rounded-lg object-top",
    onError: () => setThumbnailImageError(true)
  }) : /*#__PURE__*/React.createElement("img", {
    src: DEFAULT_IMAGES.THUMBNAIL,
    alt: "Default Thumbnail",
    className: "w-full h-full object-contain rounded-lg object-top"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-3 hover:text-blue-400 transition-colors"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-sm mb-4"
  }, /*#__PURE__*/React.createElement(CardInfoCount, {
    viewCount: viewCount,
    starCount: starCount,
    commentCount: commentCount
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, tags.map((tag, index) => /*#__PURE__*/React.createElement(Tag, {
    key: index,
    tag: `#${tag}`,
    variant: "tech",
    removable: false,
    className: "text-xs"
  })))))));
};
export default LandingCard;