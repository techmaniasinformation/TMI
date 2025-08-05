import { useState, useCallback } from 'react';

export interface SearchConditions {
  keyword: string;
  tags: string[];
  company: string;
  category?: string;
}

export const useTagSearch = (initialConditions?: Partial<SearchConditions>) => {
  const [searchConditions, setSearchConditions] = useState<SearchConditions>({
    keyword: '',
    tags: [],
    company: '',
    category: '',
    ...initialConditions
  });

  const addSearchTag = useCallback((tag: string) => {
    if (!searchConditions.tags.includes(tag)) {
      setSearchConditions(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  }, [searchConditions.tags]);

  const removeSearchTag = useCallback((tag: string) => {
    setSearchConditions(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  const clearSearchTags = useCallback(() => {
    setSearchConditions(prev => ({
      ...prev,
      tags: []
    }));
  }, []);

  const updateKeyword = useCallback((keyword: string) => {
    setSearchConditions(prev => ({
      ...prev,
      keyword
    }));
  }, []);

  const updateCompany = useCallback((company: string) => {
    setSearchConditions(prev => ({
      ...prev,
      company
    }));
  }, []);

  const clearAllConditions = useCallback(() => {
    setSearchConditions({
      keyword: '',
      tags: [],
      company: '',
      category: ''
    });
  }, []);

  return {
    searchConditions,
    addSearchTag,
    removeSearchTag,
    clearSearchTags,
    updateKeyword,
    updateCompany,
    clearAllConditions
  };
}; 