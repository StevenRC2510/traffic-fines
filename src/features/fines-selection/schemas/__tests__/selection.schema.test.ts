import { describe, it, expect } from 'vitest';
import type { Fine } from '@shared/types/fine.types';
import { validateSelection } from '../selection.schema';

function makeFine(overrides: Partial<Fine> = {}): Fine {
  return {
    id: 'F-001',
    description: 'Test fine',
    category: 'traffic',
    amount: 100,
    surcharge: 10,
    dueDate: new Date('2026-03-30'),
    issueDate: new Date('2026-03-01'),
    expiryStatus: 'not-expired',
    totalFine: 110,
    ...overrides,
  };
}

describe('validateSelection', () => {
  describe('dependency rule (Rule D)', () => {
    it('returns error when only license fines are selected', () => {
      const fines = [makeFine({ category: 'license' })];
      const errors = validateSelection(fines);
      expect(errors).toHaveLength(1);
      expect(errors[0].rule).toBe('dependency');
    });

    it('passes when license fine is combined with a traffic fine', () => {
      const fines = [
        makeFine({ id: 'F-001', category: 'license' }),
        makeFine({ id: 'F-002', category: 'traffic' }),
      ];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'dependency')).toHaveLength(0);
    });

    it('passes when license fine is combined with a parking fine', () => {
      const fines = [
        makeFine({ id: 'F-001', category: 'license' }),
        makeFine({ id: 'F-002', category: 'parking' }),
      ];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'dependency')).toHaveLength(0);
    });

    it('passes when no license fines are selected', () => {
      const fines = [makeFine({ category: 'traffic' })];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'dependency')).toHaveLength(0);
    });

    it('includes affected fine IDs in the error', () => {
      const fines = [
        makeFine({ id: 'L-001', category: 'license' }),
        makeFine({ id: 'L-002', category: 'license' }),
      ];
      const errors = validateSelection(fines);
      expect(errors[0].affectedFineIds).toEqual(['L-001', 'L-002']);
    });
  });

  describe('incompatibility rule (Rule E)', () => {
    it('returns error when severely overdue and not-expired fines are combined', () => {
      const fines = [
        makeFine({ id: 'F-001', expiryStatus: 'severely-overdue' }),
        makeFine({ id: 'F-002', expiryStatus: 'not-expired' }),
      ];
      const errors = validateSelection(fines);
      expect(errors).toHaveLength(1);
      expect(errors[0].rule).toBe('incompatibility');
    });

    it('passes when all fines are overdue (not severely)', () => {
      const fines = [
        makeFine({ id: 'F-001', expiryStatus: 'overdue' }),
        makeFine({ id: 'F-002', expiryStatus: 'overdue' }),
      ];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'incompatibility')).toHaveLength(0);
    });

    it('passes when all fines are not expired', () => {
      const fines = [
        makeFine({ id: 'F-001', expiryStatus: 'not-expired' }),
        makeFine({ id: 'F-002', expiryStatus: 'not-expired' }),
      ];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'incompatibility')).toHaveLength(0);
    });

    it('does not trigger for overdue (non-severe) combined with not-expired', () => {
      const fines = [
        makeFine({ id: 'F-001', expiryStatus: 'overdue' }),
        makeFine({ id: 'F-002', expiryStatus: 'not-expired' }),
      ];
      const errors = validateSelection(fines);
      expect(errors.filter((e) => e.rule === 'incompatibility')).toHaveLength(0);
    });

    it('includes both severely overdue and not-expired IDs in affected', () => {
      const fines = [
        makeFine({ id: 'S-001', expiryStatus: 'severely-overdue' }),
        makeFine({ id: 'N-001', expiryStatus: 'not-expired' }),
      ];
      const errors = validateSelection(fines);
      expect(errors[0].affectedFineIds).toContain('S-001');
      expect(errors[0].affectedFineIds).toContain('N-001');
    });
  });

  describe('combined rules', () => {
    it('can trigger both rules simultaneously', () => {
      const fines = [
        makeFine({ id: 'L-001', category: 'license', expiryStatus: 'severely-overdue' }),
        makeFine({ id: 'L-002', category: 'license', expiryStatus: 'not-expired' }),
      ];
      const errors = validateSelection(fines);
      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.rule)).toContain('dependency');
      expect(errors.map((e) => e.rule)).toContain('incompatibility');
    });
  });
});
