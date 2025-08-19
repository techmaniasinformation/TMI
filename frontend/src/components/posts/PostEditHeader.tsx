import React from 'react';
import { useParams } from 'react-router-dom';

interface PostEditHeaderProps {
  onCancel: () => void;
}

const PostEditHeader: React.FC<PostEditHeaderProps> = ({ onCancel }) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        게시글 수정
      </h1>
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
      >
        <span className="text-xl">←</span>
        <span>돌아가기</span>
      </button>
    </div>
  );
};

export default PostEditHeader;

