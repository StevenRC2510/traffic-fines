import type { Fine } from '@shared/types/fine.types';

export interface UseFinesReturn {
  fines: Fine[];
  isLoading: boolean;
  error: string | null;
}
