import { useState, useCallback } from 'react';
import type { UseConfirmationDialogReturn } from './useConfirmationDialog.types';

export function useConfirmationDialog(): UseConfirmationDialogReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const confirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, open, close, confirm };
}
