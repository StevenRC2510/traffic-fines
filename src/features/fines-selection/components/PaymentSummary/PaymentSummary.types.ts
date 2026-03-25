import type { PaymentSummary, ValidationError } from '../../types/fine.types';

export interface PaymentSummaryProps {
  summary: PaymentSummary;
  errors: ValidationError[];
}
