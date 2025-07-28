import React from 'react';
import { Tag } from '@/components/domain/Tag';

interface TagAreaProps {
  tags: string[];
  maxTags?: number;
}

const TagArea: React.FC<TagAreaProps> = ({ 
  tags, 
  maxTags = 5 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.slice(0, maxTags).map((tag, index) => (
        <Tag 
          key={index} 
          tag={tag} 
          variant="default"
        />
      ))}
    </div>
  );
};

export { TagArea }; 