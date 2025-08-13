import React from 'react';

// 알림 데이터를 불러오는 동안 사용자에게 로딩 중이라는 화면을 보여주는 컴포넌트
const NotificationLoader: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-prime-btn rounded-full mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">알림 불러오는 중...</h3>
      <p className="text-gray-500 dark:text-gray-400">잠시만 기다려주세요.</p>
    </div>
  );
};

export default NotificationLoader;