import React from 'react';

interface CardInfoCountProps {
  views: number;
  stars: number;
  formatNumber: (num: number) => string;
}

const CardInfoCount: React.FC<CardInfoCountProps> = ({ 
  views, 
  stars, 
  formatNumber 
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        <i className="fas fa-eye"></i>
        {formatNumber(views)}
      </span>
      <span className="flex items-center gap-1">
        <i className="fas fa-star text-yellow-400"></i>
        {formatNumber(stars)}
      </span>
    </div>
  );
};

export { CardInfoCount }; 