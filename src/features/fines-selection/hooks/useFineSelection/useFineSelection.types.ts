import type { Fine } from '@shared/types/fine.types';

export interface UseFineSelectionReturn {
  selectedFineIds: Set<string>;
  selectedFines: Fine[];
  toggleFine: (fineId: string) => void;
}
