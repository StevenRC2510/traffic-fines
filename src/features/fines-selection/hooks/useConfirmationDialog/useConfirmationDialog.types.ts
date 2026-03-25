export interface UseConfirmationDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  confirm: () => void;
}
