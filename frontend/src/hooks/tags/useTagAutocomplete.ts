import { useTagAutocompleteState } from './useTagAutocompleteState';
import { useTagAutocompleteEvents } from './useTagAutocompleteEvents';
import type { 
  AutocompleteTag, 
  UseTagAutocompleteOptions, 
  UseTagAutocompleteReturn 
} from '@/types/tag.types';

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