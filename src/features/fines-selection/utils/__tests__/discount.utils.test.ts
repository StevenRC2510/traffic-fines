import { describe, it, expect } from 'vitest';
import type { Fine } from '@shared/types/fine.types';
import {
  calculateEarlyPaymentDiscount,
  calculateFineSubtotal,
  calculateVolumeDiscount,
} from '../discount.utils';

function makeFine(overrides: Partial<Fine> = {}): Fine {
  return {
    id: 'F-001',
    description: 'Test fine',
    category: 'traffic',
    amount: 100,
    surcharge: 10,
    dueDate: new Date('2026-04-15'),
    issueDate: new Date('2026-03-01'),
    expiryStatus: 'not-expired',
    totalFine: 110,
    ...overrides,
  };
}

describe('calculateEarlyPaymentDiscount', () => {
  const currentDate = new Date('2026-03-24');

  it('applies 10% discount when more than 10 days until due', () => {
    const fine = makeFine({ amount: 200, dueDate: new Date('2026-04-15') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(20);
  });

  it('returns 0 when exactly 10 days until due', () => {
    const fine = makeFine({ amount: 200, dueDate: new Date('2026-04-03') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(0);
  });

  it('returns 0 when less than 10 days until due', () => {
    const fine = makeFine({ amount: 200, dueDate: new Date('2026-03-30') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(0);
  });

  it('returns 0 when fine is overdue', () => {
    const fine = makeFine({ amount: 200, dueDate: new Date('2026-03-01') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const fine = makeFine({ amount: 133, dueDate: new Date('2026-04-15') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(13.3);
  });

  it('applies discount to amount only, not surcharge', () => {
    const fine = makeFine({ amount: 100, surcharge: 50, dueDate: new Date('2026-04-15') });
    expect(calculateEarlyPaymentDiscount(fine, currentDate)).toBe(10);
  });
});

describe('calculateFineSubtotal', () => {
  const currentDate = new Date('2026-03-24');

  it('returns amount + surcharge when no early discount', () => {
    const fine = makeFine({ amount: 120, surcharge: 20, dueDate: new Date('2026-03-01') });
    expect(calculateFineSubtotal(fine, currentDate)).toBe(140);
  });

  it('subtracts early discount from amount before adding surcharge', () => {
    const fine = makeFine({ amount: 200, surcharge: 30, dueDate: new Date('2026-04-15') });
    // early discount: 200 * 0.10 = 20
    expect(calculateFineSubtotal(fine, currentDate)).toBe(210);
  });
});

describe('calculateVolumeDiscount', () => {
  const currentDate = new Date('2026-03-24');

  it('returns 0 when fewer than 3 fines', () => {
    const fines = [makeFine(), makeFine({ id: 'F-002' })];
    expect(calculateVolumeDiscount(fines, currentDate)).toBe(0);
  });

  it('applies 5% on eligible subtotals with exactly 3 fines', () => {
    const fines = [
      makeFine({ id: 'F-001', amount: 120, surcharge: 20, dueDate: new Date('2026-03-01') }),
      makeFine({ id: 'F-002', amount: 80, surcharge: 0, dueDate: new Date('2026-02-20') }),
      makeFine({ id: 'F-003', amount: 200, surcharge: 50, dueDate: new Date('2026-01-15') }),
    ];
    // Subtotals: 140 + 80 + 250 = 470 → 5% = 23.50
    expect(calculateVolumeDiscount(fines, currentDate)).toBe(23.5);
  });

  it('excludes license fines from discount base but counts them', () => {
    const fines = [
      makeFine({ id: 'F-001', amount: 100, surcharge: 0, dueDate: new Date('2026-03-01') }),
      makeFine({ id: 'F-002', amount: 100, surcharge: 0, dueDate: new Date('2026-03-01') }),
      makeFine({ id: 'F-003', amount: 200, surcharge: 0, category: 'license', dueDate: new Date('2026-04-15') }),
    ];
    // 3 fines → threshold met. License excluded from base.
    // Eligible subtotals: 100 + 100 = 200 → 5% = 10
    expect(calculateVolumeDiscount(fines, currentDate)).toBe(10);
  });

  it('returns 0 when all fines are license category', () => {
    const fines = [
      makeFine({ id: 'F-001', category: 'license' }),
      makeFine({ id: 'F-002', category: 'license' }),
      makeFine({ id: 'F-003', category: 'license' }),
    ];
    expect(calculateVolumeDiscount(fines, currentDate)).toBe(0);
  });
});
