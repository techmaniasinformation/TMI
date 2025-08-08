import * as React from 'react';
import { cn } from '@/utils/utils';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: string;
  variant?: 'default' | 'company' | 'tech' | 'search';
  removable?: boolean;
  onRemove?: () => void;
}

export default function Tag({ 
  className, 
  variant = 'default',
  tag, 
  removable = false,
  onRemove,
  ...props 
}: TagProps) {
  // 인라인 스타일 정의
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none';
  
  const variantStyles = {
    default: 'bg-light-bg text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-dark-bg dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
    company: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700 dark:hover:bg-emerald-900/30',
    tech: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-sm dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-indigo-900/30',
    search: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/30'
  };

  const getRemoveButtonStyles = (variant: 'default' | 'company' | 'tech' | 'search') => {
    switch (variant) {
      case 'company':
        return 'bg-emerald-200 hover:bg-emerald-300 text-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:text-emerald-200';
      case 'tech':
        return 'bg-indigo-200 hover:bg-indigo-300 text-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:text-indigo-200';
      case 'search':
        return 'bg-amber-200 hover:bg-amber-300 text-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 dark:text-amber-200';
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300';
    }
  };

  return (
    <div 
      className={cn(
        baseStyles,
        variantStyles[variant],
        removable && 'pr-1',
        className
      )}
      {...props}
    >
      <span className="mr-1">{tag}</span>
      {removable && (
        <button
          className={cn(
            "ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors",
            getRemoveButtonStyles(variant)
          )}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={`${tag} 태그 제거`}
        >
          <span className="text-xs font-bold leading-none">×</span>
        </button>
      )}
    </div>
  );
} 