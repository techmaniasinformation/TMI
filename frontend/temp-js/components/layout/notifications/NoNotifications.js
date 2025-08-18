import React from 'react';

// 컴포넌트에 전달될 props의 타입을 정의합니다.
// showUnreadOnly가 true면 '읽지 않은 알림 없음' 메시지를 보여줍니다.

// 알림이 하나도 없을 때 화면에 보여줄 컴포넌트
const NoNotifications = ({
  showUnreadOnly
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bell text-4xl text-gray-300 dark:text-gray-600 mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium text-gray-900 dark:text-white mb-2"
  }, showUnreadOnly ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400"
  }, "\uC0C8\uB85C\uC6B4 \uC54C\uB9BC\uC774 \uC624\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4."));
};
export default NoNotifications;