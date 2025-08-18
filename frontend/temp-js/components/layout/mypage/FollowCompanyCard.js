import React from "react";
import { handleCompanyImageError } from "@/utils/defaultImages";
const FollowCompanyCard = ({
  id,
  name,
  image,
  onClick
}) => {
  return /*#__PURE__*/React.createElement("div", {
    key: id,
    className: "flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("img", {
    src: image || "",
    alt: name,
    onError: handleCompanyImageError,
    className: "w-16 h-16 rounded-lg object-contain"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-gray-900 dark:text-white"
  }, name));
};
export default FollowCompanyCard;