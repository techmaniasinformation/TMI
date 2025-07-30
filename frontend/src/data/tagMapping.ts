// 태그 타입 정의
export enum TagType {
  TECH = 'TECH',
  COMPANY = 'COMPANY'
}

// 태그 인터페이스
export interface Tag {
  id: number;
  name: string;
  type: TagType;
}

// 기술 태그 매핑 (techTags)
export const techTags: Tag[] = [
  { id: 1, name: 'Spring', type: TagType.TECH },
  { id: 2, name: 'React', type: TagType.TECH },
  { id: 3, name: 'Vue.js', type: TagType.TECH },
  { id: 4, name: 'Angular', type: TagType.TECH },
  { id: 5, name: 'Node.js', type: TagType.TECH },
  { id: 6, name: 'Python', type: TagType.TECH },
  { id: 7, name: 'Java', type: TagType.TECH },
  { id: 8, name: 'JavaScript', type: TagType.TECH },
  { id: 9, name: 'TypeScript', type: TagType.TECH },
  { id: 10, name: 'Django', type: TagType.TECH },
  { id: 11, name: 'Flask', type: TagType.TECH },
  { id: 12, name: 'Express.js', type: TagType.TECH },
  { id: 13, name: 'Next.js', type: TagType.TECH },
  { id: 14, name: 'Nuxt.js', type: TagType.TECH },
  { id: 15, name: 'Docker', type: TagType.TECH },
  { id: 16, name: 'Kubernetes', type: TagType.TECH },
  { id: 17, name: 'AWS', type: TagType.TECH },
  { id: 18, name: 'GCP', type: TagType.TECH },
  { id: 19, name: 'Azure', type: TagType.TECH },
  { id: 20, name: 'MySQL', type: TagType.TECH },
  { id: 21, name: 'PostgreSQL', type: TagType.TECH },
  { id: 22, name: 'MongoDB', type: TagType.TECH },
  { id: 23, name: 'Redis', type: TagType.TECH },
  { id: 24, name: 'GraphQL', type: TagType.TECH },
  { id: 25, name: 'REST API', type: TagType.TECH },
  { id: 26, name: 'Jest', type: TagType.TECH },
  { id: 27, name: 'Cypress', type: TagType.TECH },
  { id: 28, name: 'Selenium', type: TagType.TECH },
  { id: 29, name: 'Git', type: TagType.TECH },
  { id: 30, name: 'GitHub', type: TagType.TECH },
];

// 회사 태그 매핑 (companyTags)
export const companyTags: Tag[] = [
  { id: 1, name: '네이버', type: TagType.COMPANY },
  { id: 2, name: '카카오', type: TagType.COMPANY },
  { id: 3, name: '구글', type: TagType.COMPANY },
  { id: 4, name: '애플', type: TagType.COMPANY },
  { id: 5, name: '마이크로소프트', type: TagType.COMPANY },
  { id: 6, name: '아마존', type: TagType.COMPANY },
  { id: 7, name: '메타', type: TagType.COMPANY },
  { id: 8, name: '넷플릭스', type: TagType.COMPANY },
  { id: 9, name: '우버', type: TagType.COMPANY },
  { id: 10, name: '에어비앤비', type: TagType.COMPANY },
  { id: 11, name: '스포티파이', type: TagType.COMPANY },
  { id: 12, name: '슬랙', type: TagType.COMPANY },
  { id: 13, name: '디즈니', type: TagType.COMPANY },
  { id: 14, name: '테슬라', type: TagType.COMPANY },
  { id: 15, name: '스페이스X', type: TagType.COMPANY },
];

// 태그 이름으로 ID 찾기
export const findTagIdByName = (name: string, type: TagType): number | null => {
  const tags = type === TagType.TECH ? techTags : companyTags;
  const tag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
  return tag ? tag.id : null;
};

// 태그 ID로 이름 찾기
export const findTagNameById = (id: number, type: TagType): string | null => {
  const tags = type === TagType.TECH ? techTags : companyTags;
  const tag = tags.find(t => t.id === id);
  return tag ? tag.name : null;
};

// 태그 이름 배열을 ID 배열로 변환
export const convertTagNamesToIds = (names: string[], type: TagType): number[] => {
  return names
    .map(name => findTagIdByName(name, type))
    .filter((id): id is number => id !== null);
};

// 태그 ID 배열을 이름 배열로 변환
export const convertTagIdsToNames = (ids: number[], type: TagType): string[] => {
  return ids
    .map(id => findTagNameById(id, type))
    .filter((name): name is string => name !== null);
}; 