import React from "react";
import { Badge } from "@/components/domain/Badge";

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

  return (
    <div
      key={id}
      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick} // 카드 클릭 시 동작
    >
      {/* 썸네일 이미지 */}
      <img
        src={thumbnail}
        alt={title}
        className="w-[200px] h-[120px] object-cover rounded-lg"
      />

      {/* 게시글 정보 */}
      <div className="flex-1">
        {/* 제목 */}
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* 조회수, 좋아요, 댓글 수 */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <i className="fas fa-eye mr-1"></i> {/* 눈 아이콘 (FontAwesome 기반) */}
            {views.toLocaleString()}
          </span>
          <span className="flex items-center">
            <i className="fas fa-star mr-1"></i> {/* 별 아이콘 */}
            {stars}
          </span>
          <span className="flex items-center">
            <i className="fas fa-comment mr-1"></i> {/* 말풍선 아이콘 */}
            {comments}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
