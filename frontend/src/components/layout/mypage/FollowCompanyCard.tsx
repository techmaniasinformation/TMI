import React from "react";
import { handleCompanyImageError } from "@/utils/defaultImages";

interface FollowCompanyCardProps {
  id: string;
  name: string;
  image: string | null; // null 허용으로 변경
  onClick?: () => void;
}

const FollowCompanyCard: React.FC<FollowCompanyCardProps> = ({ id, name, image, onClick }) => {

  return (
    <div
      key={id}
      className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <img
        src={image || ""}
        alt={name}
        onError={handleCompanyImageError}
        className="w-16 h-16 rounded-lg object-contain"
      />
      <span className="font-medium text-gray-900 dark:text-white">{name}</span>
    </div>
  );
};

export default FollowCompanyCard;
