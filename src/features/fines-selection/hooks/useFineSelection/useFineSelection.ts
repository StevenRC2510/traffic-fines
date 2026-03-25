import { useState, useCallback, useMemo } from 'react';
import type { Fine } from '@shared/types/fine.types';
import type { UseFineSelectionReturn } from './useFineSelection.types';

export function useFineSelection(fines: Fine[]): UseFineSelectionReturn {
  const [selectedFineIds, setSelectedFineIds] = useState<Set<string>>(new Set());

  const toggleFine = useCallback((fineId: string) => {
    setSelectedFineIds((prev) => {
      const next = new Set(prev);
      if (next.has(fineId)) {
        next.delete(fineId);
      } else {
        next.add(fineId);
      }
      return next;
    });
  }, []);

  const selectedFines = useMemo(
    () => fines.filter((fine) => selectedFineIds.has(fine.id)),
    [fines, selectedFineIds]
  );

  return { selectedFineIds, selectedFines, toggleFine };
}
