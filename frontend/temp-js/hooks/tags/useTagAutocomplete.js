import { useState, useCallback, useRef, useEffect } from 'react';

// 통합 태그 타입 (UI에서 사용)

const API_BASE_URL = 'https://i13a509.p.ssafy.io/api/v1';
export const useTagAutocomplete = (options = {}) => {
  const {
    minLength = 1,
    debounceMs = 300
  } = options;
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagSearchResults, setTagSearchResults] = useState({
    techTags: [],
    companyTags: []
  });
  const debounceTimerRef = useRef(undefined);
  const abortControllerRef = useRef(undefined);

  // API 호출 함수
  const fetchTagSuggestions = useCallback(async query => {
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
          'Content-Type': 'application/json'
        },
        signal: abortController.signal
      });
      if (!response.ok) {
        throw new Error(`태그 검색 API 호출 실패: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status !== 'SUCCESS') {
        throw new Error('태그 검색 API 응답이 성공하지 않았습니다.');
      }

      // 원본 API 응답 저장
      setTagSearchResults({
        techTags: data.data.techTags || [],
        companyTags: data.data.companyTags || []
      });

      // 백엔드 응답을 AutocompleteTag 형식으로 변환
      const techTags = data.data.techTags.map(tag => ({
        id: tag.techTagId,
        name: tag.techName,
        type: 'tech'
      }));
      const companyTags = data.data.companyTags.map(tag => ({
        id: tag.companyTagId,
        name: tag.companyName,
        type: 'company'
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
  const searchTags = useCallback(query => {
    // 이전 디바운스 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 검색어가 최소 길이보다 짧으면 제안 목록 초기화
    if (query.length < minLength) {
      setSuggestions([]);
      setError(null);
      setTagSearchResults({
        techTags: [],
        companyTags: []
      });
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
        setTagSearchResults({
          techTags: [],
          companyTags: []
        });
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [fetchTagSuggestions, minLength, debounceMs]);

  // 제안 목록 초기화
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setTagSearchResults({
      techTags: [],
      companyTags: []
    });
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
    tagSearchResults
  };
};