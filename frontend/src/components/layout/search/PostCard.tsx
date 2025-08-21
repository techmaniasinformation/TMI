import React from 'react';
import { Post } from '@/types';
import { getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = [],
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // 검색어 하이라이트 함수
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  // 태그 하이라이트 함수
  const highlightTag = (tag: string, searchTags: string[]) => {
    if (searchTags.includes(tag)) {
      return `<span class="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">${tag}</span>`;
    }
    return tag;
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex">
        {/* 썸네일 */}
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={imageError ? DEFAULT_IMAGES.THUMBNAIL : getSafeThumbnailUrl(post.thumbnailUrl)}
            alt={post.title}
            className="w-full h-full object-cover rounded-l-lg"
            onError={handleImageError}
          />
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 p-4">
          {/* 제목 */}
          <h3
            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: highlightText(post.title, searchKeyword),
            }}
          />

          {/* 작성자 정보 */}
          <div className="flex items-center mb-2">
            <img
              src={post.memberProfileUrl || DEFAULT_IMAGES.PROFILE}
              alt="Profile"
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {post.name}
            </span>
            {post.badgeUrl && (
              <img
                src={post.badgeUrl}
                alt="Badge"
                className="w-5 h-5 rounded-full ml-2"
              />
            )}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                dangerouslySetInnerHTML={{
                  __html: highlightTag(tag, [...searchTechTags, ...searchCompanyTags]),
                }}
              />
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="mr-4">
              <i className="fas fa-eye mr-1"></i>
              {post.viewCount}
            </span>
            <span className="mr-4">
              <i className="fas fa-star mr-1"></i>
              {post.starCount}
            </span>
            <span>
              <i className="fas fa-comment mr-1"></i>
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 