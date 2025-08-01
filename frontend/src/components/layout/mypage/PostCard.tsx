import React from "react";
import DefaultThumbnail from "@/assets/icons/star.svg"; // 기본 썸네일로 사용할 아이콘
import CardInfoCount from "@/components/domain/article/CardInfoCount"; // 조회수, 좋아요, 댓글 수 뱃지 컴포넌트

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

// 게시글 정보를 카드 형식으로 표시하는 컴포넌트
const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  // 구조 분해 할당으로 post 객체 내부 값 추출
  const { id, title, thumbnail, tags, views, stars, comments } = post;

  // 이미지 로딩 오류 시 fallback 이미지로 대체
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DefaultThumbnail;
  };

  return (
    <div
      key={id}
      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick} // 카드 클릭 시 동작
    >
      {/* 썸네일 이미지 (오류 시 대체 이미지로 변경) */}
      <img
        src={thumbnail}
        alt={title}
        className="w-[200px] h-[120px] object-contain rounded-lg"
        onError={handleImageError}
      />

      {/* 게시글 정보 */}
      <div className="flex-1">
        {/* 제목 */}
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>

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

        {/* 조회수, 좋아요, 댓글 수 뱃지로 표시 */}
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
