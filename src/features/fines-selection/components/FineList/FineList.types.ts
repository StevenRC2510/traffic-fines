import type { Fine } from '@shared/types/fine.types';

export interface FineListProps {
  fines: Fine[];
  selectedFineIds: Set<string>;
  affectedFineIds: Set<string>;
  onToggle: (fineId: string) => void;
  currentDate: Date;
}
