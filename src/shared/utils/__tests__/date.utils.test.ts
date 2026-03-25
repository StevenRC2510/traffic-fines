import { describe, it, expect } from 'vitest';
import { daysUntilDue, classifyExpiryStatus } from '../date.utils';

describe('daysUntilDue', () => {
  it('returns positive days when due date is in the future', () => {
    const due = new Date('2026-04-10');
    const current = new Date('2026-04-01');
    expect(daysUntilDue(due, current)).toBe(9);
  });

  it('returns 0 when due date is today', () => {
    const date = new Date('2026-04-01');
    expect(daysUntilDue(date, date)).toBe(0);
  });

  it('returns negative days when overdue', () => {
    const due = new Date('2026-03-01');
    const current = new Date('2026-03-24');
    expect(daysUntilDue(due, current)).toBe(-23);
  });

  it('handles month boundaries', () => {
    const due = new Date('2026-02-28');
    const current = new Date('2026-03-02');
    expect(daysUntilDue(due, current)).toBe(-2);
  });

  it('handles year boundaries', () => {
    const due = new Date('2025-12-30');
    const current = new Date('2026-01-02');
    expect(daysUntilDue(due, current)).toBe(-3);
  });
});

describe('classifyExpiryStatus', () => {
  const currentDate = new Date('2026-03-24');

  it('returns not-expired when due date is in the future', () => {
    expect(classifyExpiryStatus(new Date('2026-04-15'), currentDate)).toBe('not-expired');
  });

  it('returns not-expired when due date is today', () => {
    expect(classifyExpiryStatus(new Date('2026-03-24'), currentDate)).toBe('not-expired');
  });

  it('returns overdue when 1 day past due', () => {
    expect(classifyExpiryStatus(new Date('2026-03-23'), currentDate)).toBe('overdue');
  });

  it('returns overdue at exactly 30 days past due', () => {
    expect(classifyExpiryStatus(new Date('2026-02-22'), currentDate)).toBe('overdue');
  });

  it('returns severely-overdue at 31 days past due', () => {
    expect(classifyExpiryStatus(new Date('2026-02-21'), currentDate)).toBe('severely-overdue');
  });

  it('returns severely-overdue for very old fines', () => {
    expect(classifyExpiryStatus(new Date('2025-01-01'), currentDate)).toBe('severely-overdue');
  });
});
