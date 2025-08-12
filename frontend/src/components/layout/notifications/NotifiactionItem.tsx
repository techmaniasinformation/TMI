import React from 'react';

// 사용할 이미지 아이콘들을 불러옵니다
import DeleteIcon from '@/assets/icons/graytrash.svg';
import ExBadge from '@/assets/icons/exbadge.svg';
import ExPeople from '@/assets/icons/expeople.svg';
import ExCompany from '@/assets/icons/excompany.svg';

// 알림 하나의 정보 구조 (타입 지정)
interface Notification {
  id: string;
  type: 'badge' | 'comment' | 'post';
  message: string;
  timestamp: string;
  isRead: boolean;
  userAvatar?: string;
}

// props(부모로부터 받는 값) 구조 정의
interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

// 알림 하나를 화면에 보여주는 컴포넌트
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onDelete,
}) => {
  // 알림 타입에 따라 기본 프로필 이미지를 선택하는 함수
  const getDefaultAvatar = (type: string) => {
    switch (type) {
      case 'badge': return ExBadge;
      case 'comment': return ExPeople;
      case 'post': return ExCompany;
      default: return ExPeople;
    }
  };

  // 시간 문자열을 '방금 전', '3시간 전' 처럼 보기 쉽게 바꾸는 함수
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR');
  };

  return (
    // 알림 박스
    <div
      onClick={() => onClick(notification)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50"
    >
      {/* 알림 왼쪽: 프로필 이미지 */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {/* 동그란 프로필 영역 */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={notification.userAvatar ?? getDefaultAvatar(notification.type)}
              alt="프로필"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 알림 오른쪽: 메시지와 시간 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 알림 메시지 - 읽음 여부에 따라 글자 색 다르게 */}
              <p className={`text-sm mb-1 ${notification.isRead ? 'text-[#4b5563]' : 'text-gray-900'}`}>
                {notification.message}
              </p>
              {/* 알림 시간 표시 */}
              <p className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</p>
            </div>

            {/* 오른쪽 상단: 파란 점(안 읽었을 때) + 휴지통 아이콘 */}
            <div className="flex items-center gap-4 ml-4 h-6 pt-2">
              {/* 안 읽었으면 파란 점 표시 */}
              {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              {/* 삭제 버튼 */}
              <button
                onClick={(e) => onDelete(notification.id, e)}
                className="hover:opacity-70 transition-opacity"
              >
                <img src={DeleteIcon} alt="삭제" className="w-4 h-4 object-contain" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;