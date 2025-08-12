import React from 'react';
import { Badge } from "@/components/domain/Badge";
import { getSafeProfileUrl } from "@/utils/defaultImages";

interface Post {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
    company: string;
  };
  tags: string[];
  content: string;
  createdAt: string;
  views: number;
  likes: number;
}

interface PostCardProps {
  post: Post;
  highlightedTags: string[];
  formatDate: (dateString: string) => string;
  formatNumber: (num: number) => string;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  highlightedTags, 
  formatDate, 
  formatNumber 
}) => {
  const isHighlightedTag = (tag: string) => {
    return highlightedTags.includes(tag);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={getSafeProfileUrl(post.author.avatar)}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {post.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span className="font-medium">{post.author.name}</span>
                <span>•</span>
                <span>{post.author.company}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 line-clamp-2">
            {post.content}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isHighlightedTag(tag)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <i className="fas fa-eye mr-1"></i>
              {formatNumber(post.views)}
            </span>
            <span className="flex items-center">
              <i className="fas fa-heart mr-1"></i>
              {formatNumber(post.likes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 