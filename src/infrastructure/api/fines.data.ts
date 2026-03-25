import type { ApiFine } from '@shared/types/fine.types';

export const MOCK_API_FINES: ApiFine[] = [
  {
    id: 'F-101',
    description: 'Speeding violation on Highway 45 - exceeded limit by 20 km/h',
    category: 'traffic',
    amount: 120,
    surcharge: 20,
    dueDate: '2026-03-01',
    issueDate: '2026-01-10',
  },
  {
    id: 'F-102',
    description: 'Illegal parking in disabled zone - Downtown area',
    category: 'parking',
    amount: 80,
    surcharge: 0,
    dueDate: '2026-02-20',
    issueDate: '2026-02-05',
  },
  {
    id: 'F-103',
    description: 'Running a red light at Main St. intersection',
    category: 'traffic',
    amount: 200,
    surcharge: 50,
    dueDate: '2026-01-15',
    issueDate: '2025-12-20',
  },
  {
    id: 'F-104',
    description: 'Driving with expired license - routine checkpoint',
    category: 'license',
    amount: 150,
    surcharge: 0,
    dueDate: '2026-03-30',
    issueDate: '2026-03-01',
  },
];
