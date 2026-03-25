import type { PaymentSummary } from '../../types/fine.types';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  summary: PaymentSummary;
  onConfirm: () => void;
  onCancel: () => void;
}
