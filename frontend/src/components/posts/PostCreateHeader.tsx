import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCreateHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        게시글 작성
      </h1>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
      >
        <span className="text-xl">←</span>
        <span>돌아가기</span>
      </button>
    </div>
  );
};

export default PostCreateHeader;

