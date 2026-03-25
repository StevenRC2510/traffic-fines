import { useMemo } from 'react';
import type { Fine } from '@shared/types/fine.types';
import type { ValidationError } from '../../types/fine.types';
import type { UseSelectionValidationReturn } from './useSelectionValidation.types';
import { validateSelection } from '../../schemas/selection.schema';

function collectAffectedFineIds(errors: ValidationError[]): Set<string> {
  const ids = new Set<string>();
  errors.forEach((err) => err.affectedFineIds.forEach((id) => ids.add(id)));
  return ids;
}

export function useSelectionValidation(selectedFines: Fine[]): UseSelectionValidationReturn {
  return useMemo(() => {
    if (selectedFines.length === 0) {
      const empty: ValidationError[] = [];
      return { errors: empty, isValid: false, affectedFineIds: new Set<string>() };
    }

    const errors = validateSelection(selectedFines);
    return {
      errors,
      isValid: errors.length === 0,
      affectedFineIds: collectAffectedFineIds(errors),
    };
  }, [selectedFines]);
}
