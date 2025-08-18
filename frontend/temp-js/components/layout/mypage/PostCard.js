import React, { useState } from "react";
import CardInfoCount from "@/components/domain/article/CardInfoCount"; // 조회수, 좋아요, 댓글 수 뱃지 컴포넌트
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from "@/utils/defaultImages";

// 게시글(Post) 객체의 타입 정의

// 컴포넌트에 전달되는 props의 타입 정의

const PostCard = ({
  post,
  onClick
}) => {
  const {
    id,
    title,
    thumbnail,
    tags,
    views,
    stars,
    comments
  } = post;

  // 이미지 에러 상태 관리
  const [imageError, setImageError] = useState(false);

  // 이미지 로딩 실패 시 기본 이미지로 대체
  const handleImageError = () => {
    setImageError(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    key: id,
    className: "flex items-start space-x-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-[200px] h-[120px] rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: imageError ? DEFAULT_IMAGES.THUMBNAIL : getSafeThumbnailUrl(thumbnail),
    alt: title,
    onError: handleImageError,
    className: "w-full h-full object-cover rounded-xl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-medium text-gray-900 dark:text-white mb-2 break-words break-all"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-3"
  }, tags.map((tag, index) => /*#__PURE__*/React.createElement("span", {
    key: index,
    className: "min-w-[60px] h-[22px] px-3 inline-flex items-center justify-center rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 whitespace-nowrap overflow-hidden text-ellipsis"
  }, tag))), /*#__PURE__*/React.createElement(CardInfoCount, {
    viewCount: views,
    starCount: stars,
    commentCount: comments
  })));
};
export default PostCard;