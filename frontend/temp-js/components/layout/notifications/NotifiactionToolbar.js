import React from 'react';

// 읽지 않은 알림만 보기 스위치
import UnreadOnlyToggle from '@/components/layout/notifications/UnreadToggle';
import CheckIcon from '@/assets/icons/check.svg';
import TrashIcon from '@/assets/icons/trash.svg';

// 이 컴포넌트에서 받을 props(부모 컴포넌트가 전달해주는 값) 정의

// 알림 페이지 상단 툴바 UI 컴포넌트
const NotificationToolbar = ({
  showUnreadOnly,
  onToggleUnreadOnly,
  onMarkAllAsRead,
  onDeleteAll
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-light-header dark:bg-dark-header rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-4"
  }, /*#__PURE__*/React.createElement(UnreadOnlyToggle, {
    checked: showUnreadOnly,
    onChange: onToggleUnreadOnly
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onMarkAllAsRead,
    className: "flex items-center gap-2 px-4 py-2 bg-prime-btn text-white text-sm rounded-lg hover:bg-prime-btn-hover transition-colors"
  }, /*#__PURE__*/React.createElement("img", {
    src: CheckIcon,
    alt: "\uC77D\uC74C",
    className: "w-4 h-4 object-contain"
  }), "\uBAA8\uB450 \uC77D\uC74C \uD45C\uC2DC"), /*#__PURE__*/React.createElement("button", {
    onClick: onDeleteAll,
    className: "flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
  }, /*#__PURE__*/React.createElement("img", {
    src: TrashIcon,
    alt: "\uC0AD\uC81C",
    className: "w-4 h-4 object-contain"
  }), "\uC804\uCCB4 \uC0AD\uC81C"))));
};
export default NotificationToolbar;