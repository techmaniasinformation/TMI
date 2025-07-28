import React from 'react';

const NoResults: React.FC = () => {
  return (
    <div className="text-center py-12">
      <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        검색 결과가 없습니다
      </h3>
      <p className="text-gray-500">
        다른 검색어나 조건으로 다시 시도해보세요.
      </p>
    </div>
  );
};

export default NoResults; 