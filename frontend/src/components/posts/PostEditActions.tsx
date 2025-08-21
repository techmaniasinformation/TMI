import React from 'react';

interface PostEditActionsProps {
  isLoading: boolean;
  handleCancel: () => void;
  handleSave: () => void;
}

const PostEditActions: React.FC<PostEditActionsProps> = ({
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
        className={`px-6 py-2 text-white rounded-md font-medium ${
          isLoading
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            저장 중...
          </div>
        ) : (
          '저장하기'
        )}
      </button>
    </div>
  );
};

export default PostEditActions;


