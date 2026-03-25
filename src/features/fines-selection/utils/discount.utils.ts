import type { Fine } from '@shared/types/fine.types';
import { daysUntilDue } from '@shared/utils/date.utils';
import {
  EARLY_PAYMENT_DISCOUNT_RATE,
  EARLY_PAYMENT_DAYS_THRESHOLD,
  VOLUME_DISCOUNT_RATE,
  VOLUME_DISCOUNT_MIN_FINES,
  FINE_CATEGORIES,
} from '@shared/constants';

export function calculateEarlyPaymentDiscount(fine: Fine, currentDate: Date): number {
  const days = daysUntilDue(fine.dueDate, currentDate);
  if (days > EARLY_PAYMENT_DAYS_THRESHOLD) {
    return Math.round(fine.amount * EARLY_PAYMENT_DISCOUNT_RATE * 100) / 100;
  }
  return 0;
}

export function calculateFineSubtotal(fine: Fine, currentDate: Date): number {
  const earlyDiscount = calculateEarlyPaymentDiscount(fine, currentDate);
  return fine.amount - earlyDiscount + fine.surcharge;
}

function isEligibleForVolumeDiscount(fine: Fine): boolean {
  return fine.category !== FINE_CATEGORIES.LICENSE;
}

// License fines count toward the 3-fine threshold but their subtotal
// is excluded from the 5% volume discount calculation.
export function calculateVolumeDiscount(fines: Fine[], currentDate: Date): number {
  if (fines.length < VOLUME_DISCOUNT_MIN_FINES) return 0;

  const eligibleSubtotal = fines
    .filter(isEligibleForVolumeDiscount)
    .reduce((sum, fine) => sum + calculateFineSubtotal(fine, currentDate), 0);

  return Math.round(eligibleSubtotal * VOLUME_DISCOUNT_RATE * 100) / 100;
}
