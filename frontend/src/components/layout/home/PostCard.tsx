import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Avatar, AvatarImage, AvatarFallback, Tag } from '@/components';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    author: string;
    authorProfile: string;
    authorBadge?: string;
    tags: string[];
    date: string;
    views: number;
    stars: number;
    thumbnail?: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* 썸네일 */}
          {post.thumbnail && (
            <div className="flex-shrink-0">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-24 h-16 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* 제목 */}
            <Link to={`/posts/${post.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            
            {/* 작성자 정보 */}
            <div className="flex items-center mt-2 space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={post.authorProfile} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{post.author}</span>
              {post.authorBadge && (
                <Tag tag={post.authorBadge} variant="default" className="text-xs" />
              )}
            </div>
            
            {/* 태그들 */}
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={index}
                  tag={tag}
                  variant="default"
                  className="text-xs"
                />
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
            
            {/* 메타 정보 */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>{post.date}</span>
              <div className="flex items-center space-x-3">
                <span>👁️ {post.views.toLocaleString()}</span>
                <span>⭐ {post.stars.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard; 