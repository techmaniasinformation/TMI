import React, { useState, useEffect } from 'react';
import { getBadgeImage } from "@/components/layout/mypage/MypageTabs";

interface BadgeModalProps {
  isOpen: boolean;
  badge: {
    badgeId: number;
    memberBadgeId?: number; // 반드시 있어야 PATCH 가능
    name: string;
    description: string;
    badgeUrl: string;
    receivedAt?: string | null;
    isRepresentative?: boolean;
  } | null;
  onClose: () => void;
  onSelect: (badge: BadgeModalProps['badge']) => void; // 배지 선택 시 호출
}

export default function BadgeModal({ 
  isOpen, 
  onClose, 
  badge, 
  onSelect 
}: BadgeModalProps) {
  const [badgeImageUrl, setBadgeImageUrl] = useState<string>('');

  useEffect(() => {
    if (badge?.badgeUrl) {
      getBadgeImage(badge.badgeUrl).then(setBadgeImageUrl);
    }
  }, [badge?.badgeUrl]);

  if (!isOpen || !badge) return null;

  const isOwned = !!badge.memberBadgeId;
  const isRep = !!badge.isRepresentative;

  const handleToggleRepresentative = async () => {
    console.log("실행 해제")
    if (!isOwned || !badge.memberBadgeId) return;

    try {
      console.log("실행중")
      if (isRep) {
        // 해제 → 22번 배지로 변경
        // This logic is removed as per the new_code, as the representative badge setting is removed.
        // The onUnsetRepresentative prop is also removed.
        console.log("경고 실행")
      } else {
        // 설정
        // This logic is removed as per the new_code, as the representative badge setting is removed.
        alert("대표 배지가 설정되었습니다.");
      }

      // onRepresentativeSet?.(); // 상위 리스트 리프레시 - Removed as per new_code
      onClose();
    } catch {
      alert("대표 배지 변경에 실패했습니다.");
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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <img
            src={badgeImageUrl || "/fallback.png"}
            alt={badge.name}
            className="w-32 h-32 mx-auto mb-4 rounded-lg object-contain"
          />
          <h3 className="text-xl font-semibold mb-2">{badge.name}</h3>
          <p className="text-gray-600 mb-4">{badge.description}</p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSelect(badge);
                onClose();
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              선택
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
