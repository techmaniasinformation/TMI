import React from 'react';

interface SearchCondition {
  keyword: string;
  tags: string[];
  company: string;
}

interface SearchConditionsProps {
  searchConditions: SearchCondition;
  onRemoveCondition: (type: 'keyword' | 'tag' | 'company', value?: string) => void;
}

const SearchConditions: React.FC<SearchConditionsProps> = ({ 
  searchConditions, 
  onRemoveCondition 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">검색 조건</h2>
      <div className="flex flex-wrap gap-2">
        {searchConditions.keyword && (
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <i className="fas fa-search mr-2"></i>
            <span>{searchConditions.keyword}</span>
            <button
              onClick={() => onRemoveCondition('keyword')}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        {searchConditions.tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <i className="fas fa-tag mr-2"></i>
            <span>{tag}</span>
            <button
              onClick={() => onRemoveCondition('tag', tag)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        
        {searchConditions.company && (
          <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            <i className="fas fa-building mr-2"></i>
            <span>{searchConditions.company}</span>
            <button
              onClick={() => onRemoveCondition('company')}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchConditions; 