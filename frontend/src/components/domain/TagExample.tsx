import React from 'react';
import { Tag } from './Tag';

const TagExample: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">🏷️ Tag 컴포넌트 예시</h2>
      
      {/* 기본 태그들 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">기본 태그들:</h3>
        <div className="flex flex-wrap gap-2">
          <Tag tag="일반태그" />
          <Tag tag="네이버" variant="company" />
          <Tag tag="TypeScript" variant="tech" />
          <Tag tag="검색어" variant="search" />
        </div>
      </div>

      {/* 제거 가능한 태그들 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">제거 가능한 태그들:</h3>
        <div className="flex flex-wrap gap-2">
          <Tag tag="제거가능" removable={true} onRemove={() => console.log('제거됨')} />
          <Tag tag="네이버" variant="company" removable={true} onRemove={() => console.log('네이버 제거됨')} />
          <Tag tag="TypeScript" variant="tech" removable={true} onRemove={() => console.log('TypeScript 제거됨')} />
          <Tag tag="검색어" variant="search" removable={true} onRemove={() => console.log('검색어 제거됨')} />
        </div>
      </div>
    </div>
  );
};

export default TagExample; 