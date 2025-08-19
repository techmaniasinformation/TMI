import { useTagAutocompleteState } from './useTagAutocompleteState';
import { useTagAutocompleteEvents } from './useTagAutocompleteEvents';

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
    techTags: any[];
    companyTags: any[];
  };
}

export const useTagAutocomplete = (options: UseTagAutocompleteOptions = {}): UseTagAutocompleteReturn => {
  const { minLength = 1, debounceMs = 300 } = options;
  
  const state = useTagAutocompleteState();
  const events = useTagAutocompleteEvents({ minLength, debounceMs, state });

  return {
    suggestions: state.suggestions,
    loading: state.loading,
    error: state.error,
    searchTags: events.searchTags,
    clearSuggestions: events.clearSuggestions,
    tagSearchResults: state.tagSearchResults,
  };
};