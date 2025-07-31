import React from 'react';
import Tag from './Tag';

interface TagAreaProps {
  tags: string[];
  maxTags?: number;
  onRemoveTag?: (tag: string) => void; // 태그에 삭제 기능 추가
}

export default function TagArea({ 
  tags, 
  maxTags = 5, 
  onRemoveTag // 태그 삭제 관련
}: TagAreaProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.slice(0, maxTags).map((tag, index) => (
        <Tag 
          key={index} 
          tag={tag} 
          variant="default"
          removable={!!onRemoveTag} // &&&& onRemoveTag 있으면 삭제 버튼 표시
          onRemove={() => onRemoveTag && onRemoveTag(tag)} // &&&& 클릭 시 부모에 알림
        />
      ))}
    </div>
  );
} 