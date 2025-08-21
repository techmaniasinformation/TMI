import React from 'react';
import PostCard from '@/components/layout/search/PostCard';
import type { Post } from '@/types';

interface PostListProps {
  posts: Post[];
  onPostClick?: (postId: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onClick={() => onPostClick?.(post.postId)}
        />
      ))}
    </div>
  );
};

export { PostList }; 