import { useRef } from 'react';
import {
  useFines,
  useFineSelection,
  usePaymentSummary,
  useSelectionValidation,
  useConfirmationDialog,
} from '../hooks';
import { FineList, PaymentSummaryPanel, ContinueButton, ConfirmationDialog } from '../components';

export default function FineSelectionPage() {
  const currentDate = useRef(new Date()).current;

  const { fines, isLoading, error } = useFines(currentDate);
  const { selectedFineIds, selectedFines, toggleFine } = useFineSelection(fines);
  const summary = usePaymentSummary(selectedFines, currentDate);
  const { errors, isValid, affectedFineIds } = useSelectionValidation(selectedFines);
  const dialog = useConfirmationDialog();

  if (isLoading) {
    return (
      <main className="max-w-page mx-auto px-4 py-6 font-sans">
        <p className="text-center text-gray-500 py-10" aria-live="polite">Loading fines...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-page mx-auto px-4 py-6 font-sans">
        <div
          role="alert"
          className="bg-error-bg border border-error-border rounded-lg p-5 text-error-text text-center"
        >
          <p className="font-bold mb-2 mt-0">Failed to load fines</p>
          <p className="m-0">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-page mx-auto px-4 py-6 font-sans">
      <h1 className="text-2xl font-bold mb-1">Select Fines to Pay</h1>
      <p className="text-sm text-gray-500 mb-6">
        Choose the fines you would like to pay. Discounts are applied automatically.
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full">
          <FineList
            fines={fines}
            selectedFineIds={selectedFineIds}
            affectedFineIds={affectedFineIds}
            onToggle={toggleFine}
            currentDate={currentDate}
          />
        </div>

        <div className="w-full md:w-80 flex-shrink-0 md:sticky md:top-6">
          <PaymentSummaryPanel summary={summary} errors={errors} />
          <ContinueButton isValid={isValid} selectedCount={summary.selectedCount} onContinue={dialog.open} />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialog.isOpen}
        summary={summary}
        onConfirm={dialog.confirm}
        onCancel={dialog.close}
      />
    </main>
  );
}
