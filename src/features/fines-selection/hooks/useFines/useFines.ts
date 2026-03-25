import { useQuery } from '@tanstack/react-query';
import { fetchFines } from '@infrastructure/api/fines.api';
import { mapApiFines } from '@infrastructure/adapters/fine.adapter';
import { QUERY_KEYS } from '@shared/constants';
import type { UseFinesReturn } from './useFines.types';

export function useFines(currentDate: Date): UseFinesReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.FINES],
    queryFn: fetchFines,
    select: (apiFines) => mapApiFines(apiFines, currentDate),
  });

  return {
    fines: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
