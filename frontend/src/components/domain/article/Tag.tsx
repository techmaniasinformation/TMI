import * as React from 'react';
import { cn } from '@/utils'; 
import { useTagStyles, useTagRemove } from '@/hooks/tags';

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
  const { baseStyles, variantStyles, getRemoveButtonStyles } = useTagStyles();
  const { getRemoveButtonProps } = useTagRemove();

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
          {...getRemoveButtonProps(tag, onRemove)}
        >
          <span className="text-xs font-bold leading-none">×</span>
        </button>
      )}
    </div>
  );
} 