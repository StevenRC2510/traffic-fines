import { useMemo } from 'react';
import type { Fine } from '@shared/types/fine.types';
import type { PaymentSummary } from './usePaymentSummary.types';
import {
  calculateEarlyPaymentDiscount,
  calculateVolumeDiscount,
} from '../../utils/discount.utils';

export function usePaymentSummary(selectedFines: Fine[], currentDate: Date): PaymentSummary {
  return useMemo(() => {
    if (selectedFines.length === 0) {
      return {
        selectedCount: 0,
        subtotal: 0,
        discounts: { earlyPaymentDiscount: 0, volumeDiscount: 0, totalDiscount: 0 },
        grandTotal: 0,
      };
    }

    const subtotal = selectedFines.reduce(
      (sum, fine) => sum + fine.totalFine,
      0
    );

    const earlyPaymentDiscount = selectedFines.reduce(
      (sum, fine) => sum + calculateEarlyPaymentDiscount(fine, currentDate),
      0
    );

    const volumeDiscount = calculateVolumeDiscount(selectedFines, currentDate);

    const totalDiscount = Math.round((earlyPaymentDiscount + volumeDiscount) * 100) / 100;
    const grandTotal = Math.round((subtotal - earlyPaymentDiscount - volumeDiscount) * 100) / 100;

    return {
      selectedCount: selectedFines.length,
      subtotal,
      discounts: {
        earlyPaymentDiscount,
        volumeDiscount,
        totalDiscount,
      },
      grandTotal,
    };
  }, [selectedFines, currentDate]);
}
