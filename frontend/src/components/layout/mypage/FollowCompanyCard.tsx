import React from "react";

// 컴포넌트에 전달될 props 타입 정의
interface FollowCompanyCardProps {
  id: string;
  name: string;
  image: string;
  onClick?: () => void;
}

// 회사 팔로우 카드 컴포넌트
const FollowCompanyCard: React.FC<FollowCompanyCardProps> = ({ id, name, image, onClick }) => {
  return (
    <div
      key={id}
      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <span className="font-medium text-gray-900">{name}</span>
    </div>
  );
};

export default FollowCompanyCard;
