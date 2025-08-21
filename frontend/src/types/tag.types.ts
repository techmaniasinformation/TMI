// 태그 관련 타입 정의
export interface AutocompleteTag {
  id: number;
  name: string;
  type: 'tech' | 'company';
}

export interface TagSearchResults {
  techTags: any[];
  companyTags: any[];
}

export interface UseTagAutocompleteOptions {
  minLength?: number;
  debounceMs?: number;
}

export interface UseTagAutocompleteReturn {
  suggestions: AutocompleteTag[];
  loading: boolean;
  error: string | null;
  searchTags: (query: string) => void;
  clearSuggestions: () => void;
  tagSearchResults: TagSearchResults;
}
