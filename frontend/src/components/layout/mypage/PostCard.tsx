import React, { useState } from "react";
import CardInfoCount from "@/components/domain/article/CardInfoCount"; // 조회수, 좋아요, 댓글 수 뱃지 컴포넌트
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from "@/utils/defaultImages";

// 게시글(Post) 객체의 타입 정의
interface Post {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  views: number;
  stars: number;
  comments: number;
}

// 컴포넌트에 전달되는 props의 타입 정의
interface PostCardProps {
  post: Post;         // 게시글 정보 객체
  onClick?: () => void; // 카드 클릭 시 실행할 함수 (선택적)
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const { id, title, thumbnail, tags, views, stars, comments } = post;

  // 이미지 에러 상태 관리
  const [imageError, setImageError] = useState(false);

  // 이미지 로딩 실패 시 기본 이미지로 대체
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      key={id}
      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      {/* 썸네일 영역 */}
      <div className="w-[200px] h-[120px] rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={imageError ? DEFAULT_IMAGES.THUMBNAIL : getSafeThumbnailUrl(thumbnail)}
          alt={title}
          onError={handleImageError}
                        className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* 게시글 정보 */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-2 break-words break-all">{title}</h3>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="min-w-[60px] h-[22px] px-3 inline-flex items-center justify-center rounded-md text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 조회수, 좋아요, 댓글 수 */}
        <CardInfoCount
          viewCount={views}
          starCount={stars}
          commentCount={comments}
        />
      </div>
    </div>
  );
};

export default PostCard;
