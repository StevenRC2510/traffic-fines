import { cn } from '@shared/utils/cn';
import type { ContinueButtonProps } from './ContinueButton.types';

export default function ContinueButton({ isValid, selectedCount, onContinue }: ContinueButtonProps) {
  const isEnabled = isValid && selectedCount > 0;
  const suffix = selectedCount > 1 ? 'fines' : 'fine';

  return (
    <button
      type="button"
      disabled={!isEnabled}
      onClick={isEnabled ? onContinue : undefined}
      className={cn(
        'w-full py-3.5 px-6 text-base font-semibold border-none rounded-lg',
        'text-white mt-4 transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        isEnabled
          ? 'bg-primary hover:bg-primary-hover cursor-pointer active:bg-primary-active'
          : 'bg-gray-400 opacity-50 cursor-not-allowed',
      )}
    >
      {isEnabled ? `Continue with ${selectedCount} ${suffix}` : 'Select fines to continue'}
    </button>
  );
}
