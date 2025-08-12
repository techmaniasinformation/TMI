import React from 'react';
import Tag from './Tag';

interface TagAreaProps {
  tags: string[];
  maxTags?: number;

  onRemoveTag?: (tag: string) => void; // 태그에 삭제 기능 추가

  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];

}

export default function TagArea({ 
  tags, 

  maxTags = 5,
  onRemoveTag, // 태그 삭제 관련
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}: TagAreaProps) {

  // 태그가 검색 조건과 완전히 일치하는지 확인하는 함수
  const isTagMatched = (tagName: string): boolean => {
    const lowerTagName = tagName.toLowerCase();
    
    // 키워드 검색과 완전히 일치하는지 확인
    if (searchKeyword && lowerTagName === searchKeyword.toLowerCase()) {
      return true;
    }
    
    // 기술 태그 검색과 완전히 일치하는지 확인
    if (searchTechTags.some(searchTag => 
      lowerTagName === searchTag.toLowerCase()
    )) {
      return true;
    }
    
    // 회사 태그 검색과 완전히 일치하는지 확인
    if (searchCompanyTags.some(searchCompany => 
      lowerTagName === searchCompany.toLowerCase()
    )) {
      return true;
    }
    
    return false;
  };

  // 태그 타입을 결정하는 함수
  const getTagVariant = (tagName: string): 'default' | 'company' | 'tech' | 'search' => {
    const lowerTagName = tagName.toLowerCase();
    
    // 검색 조건과 완전히 일치하는지 확인
    const isMatched = isTagMatched(tagName);
    
    // 검색 조건과 완전히 일치하지 않으면 기본 스타일
    if (!isMatched) {
      return 'default';
    }
    
    // 우선순위 1: 기술 태그 검색과 완전히 일치하는 경우 tech 스타일 적용 (최우선)
    if (searchTechTags.some(searchTag => 
      lowerTagName === searchTag.toLowerCase()
    )) {
      return 'tech';
    }
    
    // 우선순위 2: 회사 태그 검색과 완전히 일치하는 경우 company 스타일 적용
    if (searchCompanyTags.some(searchCompany => 
      lowerTagName === searchCompany.toLowerCase()
    )) {
      return 'company';
    }
    
    // 키워드 검색만 있는 경우는 색상 변경하지 않음 (기본 스타일 유지)
    // 우선순위 3: 키워드 검색과 완전히 일치하는 경우 search 스타일 적용 (최후순위)
    if (searchKeyword && lowerTagName === searchKeyword.toLowerCase()) {
      return 'default'; // 키워드 검색만 있을 때는 기본 스타일
    }
    
    // 기본값 (실제로는 위 조건들로 모두 처리됨)
    return 'default';
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.slice(0, maxTags).map((tag, index) => (
        <Tag 
          key={index} 
          tag={tag} 
          variant={getTagVariant(tag)}
                    removable={!!onRemoveTag} // &&&& onRemoveTag 있으면 삭제 버튼 표시
          onRemove={() => onRemoveTag && onRemoveTag(tag)} // &&&& 클릭 시 부모에 알림
        />
      ))}
    </div>
  );
} 