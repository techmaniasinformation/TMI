import { useCallback } from 'react';

export const useTagRemove = () => {
  const handleRemove = useCallback((e: React.MouseEvent, onRemove?: () => void) => {
    e.stopPropagation();
    onRemove?.();
  }, []);

  const getRemoveButtonProps = useCallback((tag: string, onRemove?: () => void) => {
    return {
      type: 'button' as const,
      onClick: (e: React.MouseEvent) => handleRemove(e, onRemove),
      'aria-label': `${tag} 태그 제거`
    };
  }, [handleRemove]);

  return {
    handleRemove,
    getRemoveButtonProps
  };
}; 