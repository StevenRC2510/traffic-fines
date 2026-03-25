import type { ValidationRule } from '@shared/constants/validation.constants';

export interface DiscountBreakdown {
  earlyPaymentDiscount: number;
  volumeDiscount: number;
  totalDiscount: number;
}

export interface PaymentSummary {
  selectedCount: number;
  subtotal: number;
  discounts: DiscountBreakdown;
  grandTotal: number;
}

export interface ValidationError {
  rule: ValidationRule;
  message: string;
  affectedFineIds: string[];
}
