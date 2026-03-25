export type FineCategory = 'traffic' | 'parking' | 'license';

export type FineExpiryStatus = 'not-expired' | 'overdue' | 'severely-overdue';

export interface Fine {
  id: string;
  description: string;
  category: FineCategory;
  amount: number;
  surcharge: number;
  dueDate: Date;
  issueDate: Date;
  expiryStatus: FineExpiryStatus;
  totalFine: number;
}

export interface ApiFine {
  id: string;
  description: string;
  category: string;
  amount: number;
  surcharge: number;
  dueDate: string;
  issueDate: string;
}
