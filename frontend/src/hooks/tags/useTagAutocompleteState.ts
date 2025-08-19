import { useState } from 'react';
import { TechTag, CompanyTag } from '@/types/api.types';
import type { AutocompleteTag } from './useTagAutocomplete';

// 태그 자동완성 상태 관리 훅
export const useTagAutocompleteState = () => {
  const [suggestions, setSuggestions] = useState<AutocompleteTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagSearchResults, setTagSearchResults] = useState<{
    techTags: TechTag[];
    companyTags: CompanyTag[];
  }>({ techTags: [], companyTags: [] });

  return {
    // 상태
    suggestions,
    loading,
    error,
    tagSearchResults,

    // 상태 설정
    setSuggestions,
    setLoading,
    setError,
    setTagSearchResults,
  };
};
