// /src/components/layout/mypage/FollowUserCard.tsx
import React from "react";
import DefaultUserImage from "@/assets/icons/expeople.svg";

interface FollowUserCardProps {
  id: number;
  nickname: string;
  image: string | null;
  badgeName?: string;         // ← 배지 "이름"을 옵션으로 받음
  onClick?: () => void;
}

const FollowUserCard: React.FC<FollowUserCardProps> = ({ id, nickname, image, badgeName, onClick }) => {
  return (
    <div
      key={id}
      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={image || DefaultUserImage}
        alt={nickname}
        onError={(e) => { e.currentTarget.src = DefaultUserImage; }}
        className="w-16 h-16 rounded-full object-contain"
      />

      <div>
        {/* 닉네임 */}
        <div className="font-medium text-gray-900">{nickname}</div>

        {/* 대표 배지 '이름' 표시 (있을 때만) */}
        {badgeName && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs">
            {badgeName}
          </span>
        )}
      </div>
    </div>
  );
};

export default FollowUserCard;
