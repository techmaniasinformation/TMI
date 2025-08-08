import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  tips?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "데이터가 없습니다",
  description,
  icon = "fas fa-search",
  iconColor = "text-gray-300",
  tips,
  className = ""
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="text-center py-12">
        <div className="mb-6">
          <i className={`${icon} text-6xl ${iconColor} mb-4`}></i>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-500 max-w-md mx-auto">{description}</p>
          )}
        </div>
        
        {tips && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            {tips}
          </div>
        )}
      </div>
    </div>
  );
};

// 검색 팁 컴포넌트
export const SearchTips = () => (
  <>
    <h4 className="font-medium text-blue-800 mb-2">검색 팁</h4>
    <ul className="text-sm text-blue-700 space-y-1 text-left">
      <li>• 기술 키워드로 검색 (예: Python, React, Spring)</li>
      <li>• 기술 태그 선택으로 정확한 검색</li>
      <li>• 회사 태그로 특정 회사 게시물 검색</li>
      <li>• 여러 조건을 조합하여 검색</li>
    </ul>
  </>
);

// 검색 결과 없음 팁 컴포넌트
export const NoResultsTips = ({ keyword }: { keyword?: string }) => (
  <>
    <h4 className="font-medium text-yellow-800 mb-2">다른 방법으로 검색해보세요</h4>
    <ul className="text-sm text-yellow-700 space-y-1 text-left">
      <li>• 다른 키워드나 태그로 검색</li>
      <li>• 검색어의 철자를 확인해보세요</li>
      <li>• 더 일반적인 키워드로 검색</li>
      <li>• 태그를 하나씩 제거해보세요</li>
    </ul>
  </>
);
