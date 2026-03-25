import type { Fine } from '@shared/types/fine.types';
import type { ValidationError } from '../types/fine.types';
import {
  FINE_CATEGORIES,
  EXPIRY_STATUS,
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
} from '@shared/constants';

function validateDependencyRule(selectedFines: Fine[]): ValidationError | null {
  const licenseFines = selectedFines.filter((f) => f.category === FINE_CATEGORIES.LICENSE);
  const nonLicenseFines = selectedFines.filter((f) => f.category !== FINE_CATEGORIES.LICENSE);

  if (licenseFines.length > 0 && nonLicenseFines.length === 0) {
    return {
      rule: VALIDATION_RULES.DEPENDENCY,
      message: VALIDATION_MESSAGES[VALIDATION_RULES.DEPENDENCY],
      affectedFineIds: licenseFines.map((f) => f.id),
    };
  }

  return null;
}

function validateIncompatibilityRule(selectedFines: Fine[]): ValidationError | null {
  const severelyOverdue = selectedFines.filter(
    (f) => f.expiryStatus === EXPIRY_STATUS.SEVERELY_OVERDUE
  );
  const notExpired = selectedFines.filter(
    (f) => f.expiryStatus === EXPIRY_STATUS.NOT_EXPIRED
  );

  if (severelyOverdue.length > 0 && notExpired.length > 0) {
    return {
      rule: VALIDATION_RULES.INCOMPATIBILITY,
      message: VALIDATION_MESSAGES[VALIDATION_RULES.INCOMPATIBILITY],
      affectedFineIds: [...severelyOverdue.map((f) => f.id), ...notExpired.map((f) => f.id)],
    };
  }

  return null;
}

export function validateSelection(selectedFines: Fine[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const dependencyError = validateDependencyRule(selectedFines);
  if (dependencyError) errors.push(dependencyError);

  const incompatibilityError = validateIncompatibilityRule(selectedFines);
  if (incompatibilityError) errors.push(incompatibilityError);

  return errors;
}
