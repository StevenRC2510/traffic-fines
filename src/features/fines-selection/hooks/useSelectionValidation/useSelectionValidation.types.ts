import type { ValidationError } from '../../types/fine.types';

export interface UseSelectionValidationReturn {
  errors: ValidationError[];
  isValid: boolean;
  affectedFineIds: Set<string>;
}
