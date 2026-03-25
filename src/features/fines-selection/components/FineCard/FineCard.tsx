import { memo } from 'react';
import { formatCurrency } from '@shared/utils/format.utils';
import { cn } from '@shared/utils/cn';
import { CATEGORY_LABELS, STATUS_LABELS } from '@shared/constants';
import { calculateEarlyPaymentDiscount, calculateFineSubtotal } from '../../utils/discount.utils';
import type { FineCardProps } from './FineCard.types';
import { CATEGORY_BADGE_CLASSES, STATUS_BADGE_CLASSES } from './FineCard.constants';
import { formatDueDate } from './FineCard.utils';

function FineCard({ fine, isSelected, hasValidationError, onToggle, currentDate }: FineCardProps) {
  const handleClick = () => onToggle(fine.id);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(fine.id);
    }
  };

  const { label: dueDateLabel, className: dueDateClassName } = formatDueDate(fine, currentDate);
  const earlyDiscount = calculateEarlyPaymentDiscount(fine, currentDate);
  const subtotal = calculateFineSubtotal(fine, currentDate);

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Fine ${fine.id}: ${fine.description}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        hasValidationError && 'border-error-border bg-red-50',
        !hasValidationError && isSelected && 'border-fine-selected-border bg-fine-selected-bg',
        !hasValidationError && !isSelected && 'border-gray-300 bg-white hover:border-gray-400',
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="w-[18px] h-[18px] cursor-pointer"
          tabIndex={-1}
          aria-hidden="true"
        />
        <span className="text-xs text-gray-400 font-mono">{fine.id}</span>
        <span className={cn('inline-block px-2 py-0.5 rounded-xl text-xs font-semibold text-white', CATEGORY_BADGE_CLASSES[fine.category])}>
          {CATEGORY_LABELS[fine.category]}
        </span>
        <span className={cn('inline-block px-2 py-0.5 rounded-xl text-xs font-semibold text-white', STATUS_BADGE_CLASSES[fine.expiryStatus])}>
          {STATUS_LABELS[fine.expiryStatus]}
        </span>
      </div>

      <p className="text-sm text-gray-600 my-2">{fine.description}</p>

      <p className={cn('text-[13px] mt-1 mb-2', dueDateClassName)}>
        {dueDateLabel}
      </p>

      <div className="flex gap-4 text-[13px] text-gray-500 flex-wrap">
        <span>Amount: {formatCurrency(fine.amount)}</span>
        {fine.surcharge > 0 && <span>Surcharge: {formatCurrency(fine.surcharge)}</span>}
        {earlyDiscount > 0 && (
          <span className="text-discount">Early discount: -{formatCurrency(earlyDiscount)}</span>
        )}
      </div>

      <div className="font-bold text-base text-gray-800 mt-2">Subtotal: {formatCurrency(subtotal)}</div>
    </div>
  );
}

export default memo(FineCard);
