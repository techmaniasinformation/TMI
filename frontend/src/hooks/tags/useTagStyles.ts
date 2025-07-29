import { useMemo } from 'react';

export const useTagStyles = () => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none';
  
  const variantStyles = useMemo(() => ({
    default: 'bg-light-bg text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-dark-bg dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
    company: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    tech: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    search: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
  }), []);

  const getRemoveButtonStyles = useMemo(() => (variant: 'default' | 'company' | 'tech' | 'search') => {
    switch (variant) {
      case 'company':
        return 'bg-emerald-200 hover:bg-emerald-300 text-emerald-700';
      case 'tech':
        return 'bg-indigo-200 hover:bg-indigo-300 text-indigo-700';
      case 'search':
        return 'bg-amber-200 hover:bg-amber-300 text-amber-700';
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300';
    }
  }, []);

  return {
    baseStyles,
    variantStyles,
    getRemoveButtonStyles
  };
}; 