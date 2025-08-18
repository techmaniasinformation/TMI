import React from 'react';

// 알림 데이터를 불러오는 동안 사용자에게 로딩 중이라는 화면을 보여주는 컴포넌트
const NotificationLoader = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-prime-btn rounded-full mb-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-medium text-gray-900 dark:text-white mb-2"
  }, "\uC54C\uB9BC \uBD88\uB7EC\uC624\uB294 \uC911..."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400"
  }, "\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694."));
};
export default NotificationLoader;