import React from 'react';

// 컴포넌트에 전달될 props의 타입을 정의합니다.
// showUnreadOnly가 true면 '읽지 않은 알림 없음' 메시지를 보여줍니다.
interface NoNotificationsProps {
  showUnreadOnly: boolean;
}

// 알림이 하나도 없을 때 화면에 보여줄 컴포넌트
const NoNotifications: React.FC<NoNotificationsProps> = ({ showUnreadOnly }) => {
  return (
    <div className="text-center py-12">
      <i className="fas fa-bell text-4xl text-gray-300 mb-4"></i>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {showUnreadOnly ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
      </h3>
      {/* 부가 설명 문구 */}
      <p className="text-gray-500">새로운 알림이 오면 여기에 표시됩니다.</p>
    </div>
  );
};

export default NoNotifications;
