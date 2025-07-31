import React from "react";
import { Badge } from "@/components/domain/Badge";

// 컴포넌트에 전달될 props 타입 정의
interface FollowUserCardProps {
  id: string;
  nickname: string;
  badge: string;
  image: string;
  onClick?: () => void;
}

// 개인 유저 팔로우 카드 컴포넌트
const FollowUserCard: React.FC<FollowUserCardProps> = ({ id, nickname, badge, image, onClick }) => {
  return (
    <div
      key={id}
      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={image}
        alt={nickname}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <div className="font-medium text-gray-900">{nickname}</div>
        <Badge className="mt-1 bg-purple-100 text-purple-800 text-xs">
          {badge}
        </Badge>
      </div>
    </div>
  );
};

export default FollowUserCard;
