import type { FineExpiryStatus } from '../types/fine.types';
import { EXPIRY_STATUS, SEVERELY_OVERDUE_DAYS_THRESHOLD } from '../constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysUntilDue(dueDate: Date, currentDate: Date): number {
  // UTC avoids timezone/DST drift
  const dueDateUtc = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const currentDateUtc = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  return Math.floor((dueDateUtc - currentDateUtc) / MS_PER_DAY);
}

export function classifyExpiryStatus(dueDate: Date, currentDate: Date): FineExpiryStatus {
  const days = daysUntilDue(dueDate, currentDate);

  if (days >= 0) return EXPIRY_STATUS.NOT_EXPIRED;
  if (days >= -SEVERELY_OVERDUE_DAYS_THRESHOLD) return EXPIRY_STATUS.OVERDUE;
  return EXPIRY_STATUS.SEVERELY_OVERDUE;
}
