import type { FineCategory, FineExpiryStatus } from '../types/fine.types';

type FineCategoryKey = 'TRAFFIC' | 'PARKING' | 'LICENSE';
type ExpiryStatusKey = 'NOT_EXPIRED' | 'OVERDUE' | 'SEVERELY_OVERDUE';

export const FINE_CATEGORIES: Record<FineCategoryKey, FineCategory> = {
  TRAFFIC: 'traffic',
  PARKING: 'parking',
  LICENSE: 'license',
};

export const CATEGORY_LABELS: Record<FineCategory, string> = {
  traffic: 'Traffic',
  parking: 'Parking',
  license: 'License',
};

export const EXPIRY_STATUS: Record<ExpiryStatusKey, FineExpiryStatus> = {
  NOT_EXPIRED: 'not-expired',
  OVERDUE: 'overdue',
  SEVERELY_OVERDUE: 'severely-overdue',
};

export const STATUS_LABELS: Record<FineExpiryStatus, string> = {
  'not-expired': 'Active',
  overdue: 'Overdue',
  'severely-overdue': 'Severely Overdue',
};

export const VALID_CATEGORIES: FineCategory[] = Object.values(FINE_CATEGORIES);
