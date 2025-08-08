import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "오류가 발생했습니다",
  message,
  icon = "fas fa-exclamation-triangle",
  actions,
  className = ""
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="text-center py-12">
        <div className="mb-6">
          <i className={`${icon} text-6xl text-red-300 mb-4`}></i>
          <h3 className="text-lg font-semibold text-red-600 mb-2">{title}</h3>
          {message && (
            <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
          )}
        </div>
        
        {actions && (
          <div className="space-y-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// 기본 에러 액션 버튼들
export const DefaultErrorActions = () => (
  <>
    <button 
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
    >
      <i className="fas fa-redo mr-2"></i>
      다시 시도
    </button>
    
    <button 
      onClick={() => window.history.back()}
      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
    >
      <i className="fas fa-arrow-left mr-2"></i>
      이전 페이지로
    </button>
  </>
);
