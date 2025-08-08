import React from "react";
import DefaultCompanyImage from "@/assets/icons/excompany.svg";

interface FollowCompanyCardProps {
  id: string;
  name: string;
  image: string | null; // null 허용으로 변경
  onClick?: () => void;
}

const FollowCompanyCard: React.FC<FollowCompanyCardProps> = ({ id, name, image, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DefaultCompanyImage;
  };

  return (
    <div
      key={id}
      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={image || DefaultCompanyImage}
        alt={name}
        onError={handleImageError}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <span className="font-medium text-gray-900">{name}</span>
    </div>
  );
};

export default FollowCompanyCard;
