import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PostEditHeaderProps {
  title: string;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

const PostEditHeader: React.FC<PostEditHeaderProps> = ({
  title,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          disabled={isSaving}
        >
          취소
        </button>
        
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostEditHeader;

