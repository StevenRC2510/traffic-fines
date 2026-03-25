import type { FineCategory, FineExpiryStatus } from '@shared/types/fine.types';

export const CATEGORY_BADGE_CLASSES: Record<FineCategory, string> = {
  traffic: 'bg-category-traffic',
  parking: 'bg-category-parking',
  license: 'bg-category-license',
};

export const STATUS_BADGE_CLASSES: Record<FineExpiryStatus, string> = {
  'not-expired': 'bg-status-active',
  overdue: 'bg-status-overdue',
  'severely-overdue': 'bg-status-severe',
};
