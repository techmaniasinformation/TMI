import React from 'react';
import Tag from './Tag';

// 하드코딩된 태그 데이터
const techTags = [
  { name: 'React', type: 'tech' },
  { name: 'Vue.js', type: 'tech' },
  { name: 'Angular', type: 'tech' },
  { name: 'JavaScript', type: 'tech' },
  { name: 'TypeScript', type: 'tech' },
  { name: 'Node.js', type: 'tech' },
  { name: 'Python', type: 'tech' },
  { name: 'Java', type: 'tech' },
  { name: 'Spring', type: 'tech' },
  { name: 'Django', type: 'tech' }
];

const companyTags = [
  { name: '네이버', type: 'company' },
  { name: '카카오', type: 'company' },
  { name: '구글', type: 'company' },
  { name: '애플', type: 'company' },
  { name: '마이크로소프트', type: 'company' },
  { name: '아마존', type: 'company' },
  { name: '메타', type: 'company' },
  { name: '넷플릭스', type: 'company' }
];

interface TagAreaProps {
  tags: string[];
  maxTags?: number;
  searchKeyword?: string;
  searchTechTags?: string[];
  searchCompanyTags?: string[];
}

export default function TagArea({ 
  tags, 
  maxTags = 5,
  searchKeyword = '',
  searchTechTags = [],
  searchCompanyTags = []
}: TagAreaProps) {
  // 태그가 검색 조건과 일치하는지 확인하는 함수
  const isTagMatched = (tagName: string): boolean => {
    const lowerTagName = tagName.toLowerCase();
    
    // 키워드 검색과 일치하는지 확인
    if (searchKeyword && lowerTagName.includes(searchKeyword.toLowerCase())) {
      return true;
    }
    
    // 기술 태그 검색과 일치하는지 확인
    if (searchTechTags.some(searchTag => 
      lowerTagName.includes(searchTag.toLowerCase())
    )) {
      return true;
    }
    
    // 회사 태그 검색과 일치하는지 확인
    if (searchCompanyTags.some(searchCompany => 
      lowerTagName.includes(searchCompany.toLowerCase())
    )) {
      return true;
    }
    
    return false;
  };

  // 태그 타입을 결정하는 함수
  const getTagVariant = (tagName: string): 'default' | 'company' | 'tech' => {
    // 검색 조건과 일치하지 않으면 기본 스타일
    if (!isTagMatched(tagName)) {
      return 'default';
    }
    
    // 기술 태그인지 확인
    const isTechTag = techTags.some((techTag: { name: string; type: string }) => 
      techTag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    // 회사 태그인지 확인
    const isCompanyTag = companyTags.some((companyTag: { name: string; type: string }) => 
      companyTag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    if (isTechTag) return 'tech';
    if (isCompanyTag) return 'company';
    return 'default';
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.slice(0, maxTags).map((tag, index) => (
        <Tag 
          key={index} 
          tag={tag} 
          variant={getTagVariant(tag)}
        />
      ))}
    </div>
  );
} 