import React from 'react';

interface BadgeModalProps {
  isOpen: boolean;
  badge: {
    id: number;
    name: string;
    image: string;
    filename: string;
  } | null;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, badge, onClose }) => {
  if (!isOpen || !badge) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[500px] max-w-[90%] flex flex-col">
        {/* 제목 (왼쪽 상단) */}
        <h2 className="text-3xl font-bold mb-4 text-left">{badge.name}</h2>

        {/* 가운데 배치되는 컨텐츠 */}
        <div className="flex flex-col flex-1 items-center">
          {/* 배지 이미지 */}
          <img
            src={badge.image}
            alt={badge.name}
            className="w-60 h-60 mb-2 object-contain"
          />

          {/* 설명 */}
          <p className="text-center text-lg text-gray-600 mb-3">
            배지 설명 들어갈 부분입니다.
          </p>

          {/* 획득 날짜 */}
          <div className="px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-2">
            2025년 8월 5일 획득
          </div>

          {/* 배지 */}
          <div className="flex w-full gap-2 mt-4">
            {/* 대표 배지로 설정 버튼 */}
            <button
                              onClick={() => {}}
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
