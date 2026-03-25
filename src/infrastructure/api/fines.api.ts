import type { ApiFine } from '@shared/types/fine.types';
import { MOCK_API_FINES } from './fines.data';

const API_SIMULATED_DELAY = 800;

export function fetchFines(): Promise<ApiFine[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_API_FINES);
    }, API_SIMULATED_DELAY);
  });
}
