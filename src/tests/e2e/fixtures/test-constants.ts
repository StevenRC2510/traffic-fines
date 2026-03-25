export {
  VALIDATION_MESSAGES,
} from '@shared/constants/validation.constants';

export {
  CATEGORY_LABELS,
} from '@shared/constants/fines.constants';

export const TEST_DATE = '2026-03-24';

export const FINE_IDS = {
  F101: 'F-101',
  F102: 'F-102',
  F103: 'F-103',
  F104: 'F-104',
} as const;

export const FINE_DESCRIPTIONS = {
  [FINE_IDS.F101]: 'Speeding violation on Highway 45 - exceeded limit by 20 km/h',
  [FINE_IDS.F102]: 'Illegal parking in disabled zone - Downtown area',
  [FINE_IDS.F103]: 'Running a red light at Main St. intersection',
  [FINE_IDS.F104]: 'Driving with expired license - routine checkpoint',
} as const;

// F-101: amount=120 + surcharge=20 = 140
export const EXPECTED_SINGLE_F101 = {
  subtotal: 140,
} as const;

// F-101(140) + F-102(80) + F-103(250) = 470
// Volume discount: 470 * 0.05 = 23.50
export const EXPECTED_THREE_FINES = {
  subtotal: 470,
  volumeDiscount: 23.50,
  total: 446.50,
} as const;

export const TOTAL_FINE_COUNT = 4;

export const LICENSE_FINE_ID = FINE_IDS.F104;

// All 4 fines: 140 + 80 + 250 + 150 = 620
// No early payment discount (no fine has >10 days remaining)
// Volume discount: non-license subtotal (140+80+250=470) * 0.05 = 23.50
// Total: 620 - 23.50 = 596.50
export const EXPECTED_ALL_FINES = {
  subtotal: 620,
  volumeDiscount: 23.50,
  total: 596.50,
};

// F-101(140) + F-102(80) + F-104(150) = 370
// Volume: non-license (140+80=220) * 0.05 = 11.00
// Total: 370 - 11.00 = 359.00
export const EXPECTED_LICENSE_VOLUME = {
  subtotal: 370,
  volumeDiscount: 11.00,
  total: 359.00,
};

// F-102 (32 days overdue) and F-103 (68 days overdue) are severely overdue
export const SEVERELY_OVERDUE_IDS = [FINE_IDS.F102, FINE_IDS.F103] as const;

// F-104 (6 days remaining) is the only not-expired fine
export const NOT_EXPIRED_IDS = [FINE_IDS.F104] as const;
