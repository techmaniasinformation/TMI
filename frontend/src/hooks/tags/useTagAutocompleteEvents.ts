import { useCallback, useRef, useEffect } from 'react';
import { fetchTagSuggestions } from '@/api/tag/tagApiService';
import type { useTagAutocompleteState } from './useTagAutocompleteState';

interface UseTagAutocompleteEventsProps {
  minLength: number;
  debounceMs: number;
  state: ReturnType<typeof useTagAutocompleteState>;
}

// 태그 자동완성 이벤트 핸들러 훅
export const useTagAutocompleteEvents = ({
  minLength,
  debounceMs,
  state,
}: UseTagAutocompleteEventsProps) => {
  const {
    setSuggestions,
    setLoading,
    setError,
    setTagSearchResults,
  } = state;

  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

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
        // 이전 요청 취소
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const result = await fetchTagSuggestions(query, minLength, abortController.signal);
        setSuggestions(result.suggestions);
        setTagSearchResults(result.tagSearchResults);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        const errorMessage = err instanceof Error ? err.message : '태그 검색 중 오류가 발생했습니다.';
        setError(errorMessage);
        setSuggestions([]);
        setTagSearchResults({ techTags: [], companyTags: [] });
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [minLength, debounceMs, setSuggestions, setError, setTagSearchResults, setLoading]);

  // 제안 목록 초기화
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setTagSearchResults({ techTags: [], companyTags: [] });
  }, [setSuggestions, setError, setTagSearchResults]);

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
    searchTags,
    clearSuggestions,
  };
};
