import React from 'react';
import DeleteIcon from '@/assets/icons/graytrash.svg';
import { DEFAULT_IMAGES, getSafeImageUrl, createImageErrorHandler } from '@/utils/defaultImages';

// 알림 하나의 정보 구조 (타입 지정)

// props(부모로부터 받는 값) 구조 정의

// 알림 하나를 화면에 보여주는 컴포넌트
const NotificationItem = ({
  notification,
  onClick,
  onDelete
}) => {
  // ✅ avatarKind 우선 → 없을 때 타입으로 폴백
  const fallbackType = notification.avatarKind ?? (notification.type === 'badge' ? 'BADGE' : notification.type === 'post' ? 'COMPANY' : 'PROFILE');
  const fallbackSrc = DEFAULT_IMAGES[fallbackType];

  // 비정상/빈 URL이면 기본값으로 치환
  const initialSrc = getSafeImageUrl(notification.userAvatar, fallbackSrc);

  // 로드 실패 시 기본값으로 교체
  const handleImgError = createImageErrorHandler(fallbackType);

  // 시간 문자열 포맷 (UTC -> KST)
  const formatTimestamp = timestamp => {
    const utcDate = new Date(timestamp);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - kstDate.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return kstDate.toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul'
    });
  };

  // 접근성: alt 문구 타입별 지정
  const altText = notification.avatarKind === 'COMPANY' || fallbackType === 'COMPANY' ? '회사' : notification.avatarKind === 'BADGE' || fallbackType === 'BADGE' ? '뱃지' : '프로필';
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onClick(notification),
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: initialSrc,
    alt: altText,
    className: "w-full h-full object-cover",
    loading: "lazy",
    decoding: "async",
    referrerPolicy: "no-referrer",
    onError: handleImgError
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: `text-sm mb-1 ${notification.isRead ? 'text-[#4b5563] dark:text-gray-400' : 'text-gray-900 dark:text-white'}`
  }, notification.message), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, formatTimestamp(notification.timestamp))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 ml-4 h-6 pt-2"
  }, !notification.isRead && /*#__PURE__*/React.createElement("div", {
    className: "w-2 h-2 bg-blue-500 rounded-full"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: e => onDelete(notification.id, e),
    className: "hover:opacity-70 transition-opacity",
    "aria-label": "\uC54C\uB9BC \uC0AD\uC81C"
  }, /*#__PURE__*/React.createElement("img", {
    src: DeleteIcon,
    alt: "\uC0AD\uC81C",
    className: "w-4 h-4 object-contain"
  })))))));
};
export default NotificationItem;