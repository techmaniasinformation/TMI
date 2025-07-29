import React from 'react';

// 읽지 않은 알림만 보기 스위치
import UnreadOnlyToggle from '@/components/layout/notifications/UnreadToggle';
import CheckIcon from '@/assets/icons/check.svg';
import TrashIcon from '@/assets/icons/trash.svg';

// 이 컴포넌트에서 받을 props(부모 컴포넌트가 전달해주는 값) 정의
interface NotificationToolbarProps {
  showUnreadOnly: boolean;
  onToggleUnreadOnly: (checked: boolean) => void;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

// 알림 페이지 상단 툴바 UI 컴포넌트
const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  showUnreadOnly,
  onToggleUnreadOnly,
  onMarkAllAsRead,
  onDeleteAll,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* 읽지 않은 알림만 보기 스위치 */}
        <UnreadOnlyToggle checked={showUnreadOnly} onChange={onToggleUnreadOnly} />
        {/* 오른쪽 버튼들: 모두 읽음 / 전체 삭제 */}
        <div className="flex gap-3">
          {/* 모두 읽음 버튼 */}
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-prime-btn text-white text-sm rounded-lg hover:bg-prime-btn-hover transition-colors">
            <img src={CheckIcon} alt="읽음" className="w-4 h-4 object-contain" />
            모두 읽음 표시
          </button>

          {/* 전체 삭제 버튼 */}
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
            <img src={TrashIcon} alt="삭제" className="w-4 h-4 object-contain" />
            전체 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToolbar;
