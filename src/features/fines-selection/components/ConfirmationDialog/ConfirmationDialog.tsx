import { useRef, useEffect } from 'react';
import { formatCurrency } from '@shared/utils/format.utils';
import type { ConfirmationDialogProps } from './ConfirmationDialog.types';

export default function ConfirmationDialog({ isOpen, summary, onConfirm, onCancel }: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  const suffix = summary.selectedCount > 1 ? 'fines' : 'fine';

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={handleBackdropClick}
      aria-labelledby="confirm-dialog-title"
      className="rounded-xl p-0 max-w-md w-full backdrop:bg-black/40 border-none shadow-lg"
    >
      <div className="p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-bold mt-0 mb-4">Confirm Payment</h2>

        <p className="text-sm text-gray-600 mb-4">
          You are about to pay {summary.selectedCount} {suffix}.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>

          {summary.discounts.totalDiscount > 0 && (
            <div className="flex justify-between text-discount">
              <span>Discounts</span>
              <span>-{formatCurrency(summary.discounts.totalDiscount)}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatCurrency(summary.grandTotal)}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-5 text-sm font-medium rounded-lg border-none bg-primary text-white cursor-pointer hover:bg-primary-hover active:bg-primary-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </dialog>
  );
}
