import type { ApiFine, Fine, FineCategory } from '@shared/types/fine.types';
import { classifyExpiryStatus } from '@shared/utils/date.utils';
import { VALID_CATEGORIES, ADAPTER_ERRORS } from '@shared/constants';

function isValidCategory(category: string): category is FineCategory {
  return VALID_CATEGORIES.some((c) => c === category);
}

function mapApiFine(raw: ApiFine, currentDate: Date): Fine {
  if (!isValidCategory(raw.category)) {
    throw new Error(ADAPTER_ERRORS.INVALID_CATEGORY);
  }

  const dueDate = new Date(raw.dueDate);
  const issueDate = new Date(raw.issueDate);

  if (isNaN(dueDate.getTime())) {
    throw new Error(ADAPTER_ERRORS.INVALID_DUE_DATE);
  }
  if (isNaN(issueDate.getTime())) {
    throw new Error(ADAPTER_ERRORS.INVALID_ISSUE_DATE);
  }

  return {
    id: raw.id,
    description: raw.description,
    category: raw.category,
    amount: raw.amount,
    surcharge: raw.surcharge,
    dueDate,
    issueDate,
    expiryStatus: classifyExpiryStatus(dueDate, currentDate),
    totalFine: raw.amount + raw.surcharge,
  };
}

export function mapApiFines(rawFines: ApiFine[], currentDate: Date): Fine[] {
  return rawFines.map((raw) => mapApiFine(raw, currentDate));
}
