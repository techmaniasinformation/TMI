// /src/components/layout/mypage/FollowUserCard.tsx
import React from "react";
import { handleProfileImageError } from "@/utils/defaultImages";
const FollowUserCard = ({
  id,
  nickname,
  image,
  badgeName,
  onClick
}) => {
  return /*#__PURE__*/React.createElement("div", {
    key: id,
    className: "flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("img", {
    src: image || "",
    alt: nickname,
    onError: handleProfileImageError,
    className: "w-16 h-16 rounded-full object-contain"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-medium text-gray-900 dark:text-white"
  }, nickname), badgeName && /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-1 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs"
  }, badgeName)));
};
export default FollowUserCard;