import type { Fine } from '@shared/types/fine.types';
import { daysUntilDue } from '@shared/utils/date.utils';
import { EARLY_PAYMENT_DAYS_THRESHOLD } from '@shared/constants';

export function formatDueDate(fine: Fine, currentDate: Date): { label: string; className: string } {
  const days = daysUntilDue(fine.dueDate, currentDate);
  const dateStr = fine.dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (days < 0) {
    return {
      label: `Overdue: ${Math.abs(days)} days (${dateStr})`,
      className: 'text-status-severe',
    };
  }
  if (days <= EARLY_PAYMENT_DAYS_THRESHOLD) {
    return {
      label: `Due: ${days} days remaining (${dateStr})`,
      className: 'text-due-warning',
    };
  }
  return { label: `Due: ${dateStr}`, className: 'text-gray-500' };
}
