import React, { useMemo, useState } from 'react';
import { getSafeProfileUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';
export default function UserInfoBox({
  profileImageUrl,
  nickname,
  badge,
  children,
  width,
  height,
  imageSize = '40px',
  // 기본값 설정
  onClick
}) {
  // 이미지 에러 상태 관리
  const [imageError, setImageError] = useState(false);

  // 안전한 프로필 이미지 URL을 메모이제이션
  const safeProfileUrl = useMemo(() => {
    return getSafeProfileUrl(profileImageUrl);
  }, [profileImageUrl]);

  // 이미지 로딩 에러 핸들러
  const handleImageError = () => {
    setImageError(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    // 수평 정렬
    className: `flex items-start gap-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]' : ''}`,
    style: {
      width,
      height
    },
    onClick: onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick ? e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    } : undefined
  }, /*#__PURE__*/React.createElement("img", {
    src: imageError ? DEFAULT_IMAGES.PROFILE : safeProfileUrl,
    alt: "profile",
    style: {
      width: imageSize,
      height: imageSize
    },
    className: "rounded-full object-cover",
    onError: handleImageError
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-sm dark:text-white"
  }, nickname), badge && badge), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, children)));
}