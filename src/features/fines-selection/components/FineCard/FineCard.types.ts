import type { Fine } from '@shared/types/fine.types';

export interface FineCardProps {
  fine: Fine;
  isSelected: boolean;
  hasValidationError: boolean;
  onToggle: (fineId: string) => void;
  currentDate: Date;
}
