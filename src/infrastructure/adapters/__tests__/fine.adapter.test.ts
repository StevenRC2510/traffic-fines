import { describe, it, expect } from 'vitest';
import { mapApiFines } from '../fine.adapter';
import type { ApiFine } from '@shared/types/fine.types';
import { ADAPTER_ERRORS } from '@shared/constants';

const CURRENT_DATE = new Date('2026-03-24');

const validApiFine: ApiFine = {
  id: 'F-001',
  description: 'Speeding on highway',
  category: 'traffic',
  amount: 150,
  surcharge: 30,
  dueDate: '2026-04-15',
  issueDate: '2026-01-10',
};

describe('mapApiFines', () => {
  it('maps a valid API fine to domain model', () => {
    const [fine] = mapApiFines([validApiFine], CURRENT_DATE);

    expect(fine.id).toBe('F-001');
    expect(fine.description).toBe('Speeding on highway');
    expect(fine.category).toBe('traffic');
    expect(fine.amount).toBe(150);
    expect(fine.surcharge).toBe(30);
    expect(fine.dueDate).toEqual(new Date('2026-04-15'));
    expect(fine.issueDate).toEqual(new Date('2026-01-10'));
    expect(fine.totalFine).toBe(180);
    expect(fine.expiryStatus).toBe('not-expired');
  });

  it('classifies overdue fines correctly', () => {
    const overdueFine: ApiFine = { ...validApiFine, dueDate: '2026-03-10' };
    const [fine] = mapApiFines([overdueFine], CURRENT_DATE);

    expect(fine.expiryStatus).toBe('overdue');
  });

  it('classifies severely overdue fines correctly', () => {
    const severelyOverdueFine: ApiFine = { ...validApiFine, dueDate: '2026-01-01' };
    const [fine] = mapApiFines([severelyOverdueFine], CURRENT_DATE);

    expect(fine.expiryStatus).toBe('severely-overdue');
  });

  it('maps multiple fines', () => {
    const fines = mapApiFines([validApiFine, { ...validApiFine, id: 'F-002' }], CURRENT_DATE);

    expect(fines).toHaveLength(2);
    expect(fines[0].id).toBe('F-001');
    expect(fines[1].id).toBe('F-002');
  });

  it('returns empty array for empty input', () => {
    const fines = mapApiFines([], CURRENT_DATE);

    expect(fines).toEqual([]);
  });

  it('throws on invalid category', () => {
    const invalidFine: ApiFine = { ...validApiFine, category: 'unknown' };

    expect(() => mapApiFines([invalidFine], CURRENT_DATE)).toThrow(ADAPTER_ERRORS.INVALID_CATEGORY);
  });

  it('throws on invalid due date', () => {
    const invalidFine: ApiFine = { ...validApiFine, dueDate: 'not-a-date' };

    expect(() => mapApiFines([invalidFine], CURRENT_DATE)).toThrow(ADAPTER_ERRORS.INVALID_DUE_DATE);
  });

  it('throws on invalid issue date', () => {
    const invalidFine: ApiFine = { ...validApiFine, issueDate: 'not-a-date' };

    expect(() => mapApiFines([invalidFine], CURRENT_DATE)).toThrow(ADAPTER_ERRORS.INVALID_ISSUE_DATE);
  });
});
