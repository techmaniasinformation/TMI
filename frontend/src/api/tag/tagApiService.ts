import { TechTag, CompanyTag, TagSearchResponse } from '@/types/api.types';
import type { AutocompleteTag } from '@/types/tag.types';

// 태그 API 서비스
const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export interface TagApiResponse {
  suggestions: AutocompleteTag[];
  tagSearchResults: {
    techTags: TechTag[];
    companyTags: CompanyTag[];
  };
}

// 태그 검색 API 호출
export const fetchTagSuggestions = async (
  query: string,
  minLength: number,
  signal?: AbortSignal
): Promise<TagApiResponse> => {
  if (query.length < minLength) {
    return {
      suggestions: [],
      tagSearchResults: { techTags: [], companyTags: [] }
    };
  }

  const url = `${API_BASE_URL}/tag?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`태그 검색 API 호출 실패: ${response.status} ${response.statusText}`);
  }

  const data: TagSearchResponse = await response.json();

  if (data.status !== 'SUCCESS') {
    throw new Error('태그 검색 API 응답이 성공하지 않았습니다.');
  }

  // 원본 API 응답 저장
  const tagSearchResults = {
    techTags: data.data.techTags || [],
    companyTags: data.data.companyTags || [],
  };

  // 백엔드 응답을 AutocompleteTag 형식으로 변환
  const techTags: AutocompleteTag[] = data.data.techTags.map((tag: TechTag) => ({
    id: tag.techTagId,
    name: tag.techName,
    type: 'tech' as const,
  }));

  const companyTags: AutocompleteTag[] = data.data.companyTags.map((tag: CompanyTag) => ({
    id: tag.companyTagId,
    name: tag.companyName,
    type: 'company' as const,
  }));

  // 기술 태그와 회사 태그를 합쳐서 반환
  const suggestions = [...techTags, ...companyTags];

  return {
    suggestions,
    tagSearchResults,
  };
};

