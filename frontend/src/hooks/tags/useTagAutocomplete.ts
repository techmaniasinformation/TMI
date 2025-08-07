import { useState, useCallback, useRef, useEffect } from 'react';

// 백엔드 API 응답 타입
interface TechTag {
  techTagId: number;
  techName: string;
}

interface CompanyTag {
  companyTagId: number;
  companyName: string; // 백엔드 API 응답 확인 필요 - 임시로 companyName 사용
}

interface TagSearchApiResponse {
  status: string;
  data: {
    techTags: TechTag[];
    companyTags: CompanyTag[];
  };
}

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

const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';

export const useTagAutocomplete = (options: UseTagAutocompleteOptions = {}) => {
  const { minLength = 1, debounceMs = 300 } = options;
  
  const [suggestions, setSuggestions] = useState<AutocompleteTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      console.log('🏷️ [fetchTagSuggestions] API 호출:', url);

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

      const data: TagSearchApiResponse = await response.json();
      console.log('✅ [fetchTagSuggestions] API 응답:', data);

      if (data.status !== 'SUCCESS') {
        throw new Error('태그 검색 API 응답이 성공하지 않았습니다.');
      }

      // 백엔드 응답을 AutocompleteTag 형식으로 변환
      const techTags: AutocompleteTag[] = data.data.techTags.map(tag => ({
        id: tag.techTagId,
        name: tag.techName,
        type: 'tech' as const,
      }));

      const companyTags: AutocompleteTag[] = data.data.companyTags.map(tag => ({
        id: tag.companyTagId,
        name: tag.companyName,
        type: 'company' as const,
      }));

      // 기술 태그와 회사 태그를 합쳐서 반환
      return [...techTags, ...companyTags];

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🏷️ [fetchTagSuggestions] 요청이 취소됨');
        return [];
      }
      
      console.error('❌ [fetchTagSuggestions] 오류:', err);
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
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [fetchTagSuggestions, minLength, debounceMs]);

  // 제안 목록 초기화
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
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
  };
};