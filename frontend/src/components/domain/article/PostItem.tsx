import React, { useState } from 'react';
import { Post } from '@/types';
import { getSafeProfileUrl, getSafeThumbnailUrl, DEFAULT_IMAGES } from '@/utils/defaultImages';

interface PostItemProps {
  post: Post;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
  maxTags?: number;
  showThumbnail?: boolean;
  onClick?: (postId: number) => void;
  className?: string;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  formatDate,
  formatNumber,
  maxTags = 5,
  showThumbnail = true,
  onClick,
  className = ''
}) => {
  // 이미지 에러 상태 관리
  const [profileImageError, setProfileImageError] = useState(false);
  const [thumbnailImageError, setThumbnailImageError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(post.postId);
    }
  };

  // 안전한 이미지 URL 사용
  const safeProfileUrl = getSafeProfileUrl(post.memberProfileUrl);
  const safeThumbnailUrl = getSafeThumbnailUrl(post.thumbnailUrl);

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
          <img
            src={profileImageError ? DEFAULT_IMAGES.PROFILE : safeProfileUrl}
            alt={post.name}
            className="w-full h-full object-contain"
            onError={() => setProfileImageError(true)}
          />
        </div>
        
        {/* 컨텐츠 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          {/* 작성자 정보 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">{post.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formatDate(post.createAt)}</span>
          </div>
          
          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.tags.slice(0, maxTags).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* 통계 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>👁️ {formatNumber(post.viewCount)}</span>
            <span>⭐ {formatNumber(post.starCount)}</span>
            <span>💬 {formatNumber(post.commentCount || 0)}</span>
          </div>
        </div>
        
        {/* 썸네일 */}
        {showThumbnail && (
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={thumbnailImageError ? DEFAULT_IMAGES.THUMBNAIL : safeThumbnailUrl}
              alt={post.title}
              className="w-full h-full object-contain rounded-lg"
              onError={() => setThumbnailImageError(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 