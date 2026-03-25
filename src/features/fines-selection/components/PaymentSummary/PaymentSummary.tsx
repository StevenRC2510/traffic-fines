import { formatCurrency } from '@shared/utils/format.utils';
import type { PaymentSummaryProps } from './PaymentSummary.types';

export default function PaymentSummaryPanel({ summary, errors }: PaymentSummaryProps) {
  if (summary.selectedCount === 0) {
    return (
      <div className="border border-gray-300 rounded-lg p-5 bg-gray-50">
        <h2 className="m-0 text-lg font-bold mb-4">Payment Summary</h2>
        <p className="text-sm text-gray-400 text-center p-5">Select fines to see the payment summary.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-5 bg-gray-50">
      <h2 className="m-0 text-lg font-bold mb-4">Payment Summary</h2>

      <div className="flex justify-between py-1.5 text-sm">
        <span>Selected fines</span>
        <span>{summary.selectedCount}</span>
      </div>

      <div className="flex justify-between py-1.5 text-sm">
        <span>Subtotal</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>

      {summary.discounts.earlyPaymentDiscount > 0 && (
        <div className="flex justify-between py-1.5 text-sm text-discount">
          <span>Early payment discount</span>
          <span>-{formatCurrency(summary.discounts.earlyPaymentDiscount)}</span>
        </div>
      )}

      {summary.discounts.volumeDiscount > 0 && (
        <div className="flex justify-between py-1.5 text-sm text-discount">
          <span>Volume discount (5%)</span>
          <span>-{formatCurrency(summary.discounts.volumeDiscount)}</span>
        </div>
      )}

      <hr className="border-t border-gray-300 my-2" />

      <div className="flex justify-between py-2 text-lg font-bold">
        <span>Total</span>
        <span>{formatCurrency(summary.grandTotal)}</span>
      </div>

      {errors.map((error) => (
        <div
          key={error.rule}
          role="alert"
          className="bg-error-bg border border-error-border rounded p-3 mt-3 text-[13px] text-error-text"
        >
          {error.message}
        </div>
      ))}
    </div>
  );
}
