export type ValidationRule = 'dependency' | 'incompatibility';

type ValidationRuleKey = 'DEPENDENCY' | 'INCOMPATIBILITY';

export const VALIDATION_RULES: Record<ValidationRuleKey, ValidationRule> = {
  DEPENDENCY: 'dependency',
  INCOMPATIBILITY: 'incompatibility',
};

export const VALIDATION_MESSAGES: Record<ValidationRule, string> = {
  dependency: 'A license fine cannot be paid alone. Please select at least one traffic or parking fine.',
  incompatibility: 'Fines overdue by more than 30 days cannot be combined with fines that have not yet expired.',
};

export const ADAPTER_ERRORS = {
  INVALID_CATEGORY: 'Invalid fine category received from server',
  INVALID_DUE_DATE: 'Invalid due date received from server',
  INVALID_ISSUE_DATE: 'Invalid issue date received from server',
};
