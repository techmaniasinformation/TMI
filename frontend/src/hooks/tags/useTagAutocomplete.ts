import { useState, useCallback, useRef, useEffect } from 'react';
import { TechTag, CompanyTag, TagSearchResponse } from '@/types/api.types';

// 통합 태그 타입 (UI에서 사용)
export interface AutocompleteTag {
  id: number;
  name: string;
  type: 'tech' | 'company';
}

interface UseTagAutocompleteOptions {
  minLength?: number; // 최소 검색어 길이
  debounceMs?: number; // 디바운스 시간
}

interface UseTagAutocompleteReturn {
  suggestions: AutocompleteTag[];
  loading: boolean;
  error: string | null;
  searchTags: (query: string) => void;
  clearSuggestions: () => void;
  tagSearchResults: {
    techTags: TechTag[];
    companyTags: CompanyTag[];
  };
}

const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export const useTagAutocomplete = (options: UseTagAutocompleteOptions = {}): UseTagAutocompleteReturn => {
  const { minLength = 1, debounceMs = 300 } = options;
  
  const [suggestions, setSuggestions] = useState<AutocompleteTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagSearchResults, setTagSearchResults] = useState<{
    techTags: TechTag[];
    companyTags: CompanyTag[];
  }>({ techTags: [], companyTags: [] });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  // API 호출 함수
  const fetchTagSuggestions = useCallback(async (query: string): Promise<AutocompleteTag[]> => {
    if (query.length < minLength) {
      return [];
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const url = `${API_BASE_URL}/tag?q=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`태그 검색 API 호출 실패: ${response.status} ${response.statusText}`);
      }

      const data: TagSearchResponse = await response.json();

      if (data.status !== 'SUCCESS') {
        throw new Error('태그 검색 API 응답이 성공하지 않았습니다.');
      }

      // 원본 API 응답 저장
      setTagSearchResults({
        techTags: data.data.techTags || [],
        companyTags: data.data.companyTags || [],
      });

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
      return [...techTags, ...companyTags];

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return [];
      }
      
      throw err;
    }
  }, [minLength]);

  // 디바운스된 검색 함수
  const searchTags = useCallback((query: string) => {
    // 이전 디바운스 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 검색어가 최소 길이보다 짧으면 제안 목록 초기화
    if (query.length < minLength) {
      setSuggestions([]);
      setError(null);
      setTagSearchResults({ techTags: [], companyTags: [] });
      return;
    }

    // 디바운스 타이머 설정
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchTagSuggestions(query);
        setSuggestions(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '태그 검색 중 오류가 발생했습니다.';
        setError(errorMessage);
        setSuggestions([]);
        setTagSearchResults({ techTags: [], companyTags: [] });
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [fetchTagSuggestions, minLength, debounceMs]);

  // 제안 목록 초기화
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setTagSearchResults({ techTags: [], companyTags: [] });
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    loading,
    error,
    searchTags,
    clearSuggestions,
    tagSearchResults,
  };
};