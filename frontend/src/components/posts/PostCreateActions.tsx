import React from 'react';

interface PostCreateActionsProps {
  isLoading: boolean;
  handleCancel: () => void;
  handleSave: () => void;
}

const PostCreateActions: React.FC<PostCreateActionsProps> = ({
  isLoading,
  handleCancel,
  handleSave,
}) => {
  return (
    <div className="flex justify-end gap-4 mt-6">
      <button
        onClick={handleCancel}
        className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
      >
        × 취소
      </button>
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            저장 중...
          </>
        ) : (
          '작성하기'
        )}
      </button>
    </div>
  );
};

export default PostCreateActions;
