import React from 'react';
import { badgeImageMap } from "@/components/layout/mypage/MypageTabs";
import { patchRepresentativeBadge } from "@/api/mypage/representativebadgeService";

interface BadgeModalProps {
  isOpen: boolean;
  badge: {
    badgeId: number;
    memberBadgeId?: number; // 반드시 있어야 PATCH 가능
    name: string;
    description: string;
    badgeUrl: string;
    receivedAt?: string;
  } | null;
  onClose: () => void;
  onRepresentativeSet?: () => void; // 대표 배지 설정 후 호출
}

const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, badge, onClose, onRepresentativeSet }) => {
  if (!isOpen || !badge) return null;

  const handleSetRepresentative = async () => {
    if (!badge.memberBadgeId) return;

    try {
      await patchRepresentativeBadge(badge.memberBadgeId);
      alert("대표 배지가 설정되었습니다.");
      onRepresentativeSet?.(); // 상위 상태 갱신 요청
      onClose(); // 모달 닫기
    } catch (err) {
      alert("대표 배지 설정에 실패했습니다.");
    }
  };

  const formattedDate = badge.receivedAt
    ? new Date(badge.receivedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) + ' 획득'
    : '아직 획득하지 않은 배지';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[500px] max-w-[90%] flex flex-col">
        {/* 제목 (왼쪽 상단) */}
        <h2 className="text-3xl font-bold mb-4 text-left">{badge.name}</h2>

        {/* 가운데 컨텐츠 */}
        <div className="flex flex-col flex-1 items-center">
          {/* 배지 이미지 */}
          <img
            src={badgeImageMap[badge.badgeUrl] || "/fallback.png"}
            alt={badge.name}
            className="w-60 h-60 mb-2 object-contain"
          />

          {/* 설명 */}
          <p className="text-center text-lg text-gray-600 mb-3">
            {badge.description}
          </p>

          {/* 획득 날짜 or 미획득 안내 */}
          <div
            className={`px-4 py-1 text-sm rounded-full flex items-center gap-2 ${
              badge.receivedAt
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {formattedDate}
          </div>

          {/* 버튼 영역 */}
          <div className="flex w-full gap-2 mt-4">
            {/* 대표 배지 설정 버튼 */}
            <button
              onClick={handleSetRepresentative}
              className="flex-1 h-12 bg-prime-btn text-white text-lg rounded hover:bg-prime-btn-hover"
            >
              대표 배지로 설정
            </button>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="flex-1 h-12 border border-gray-300 text-gray-700 text-lg rounded hover:bg-gray-100"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
