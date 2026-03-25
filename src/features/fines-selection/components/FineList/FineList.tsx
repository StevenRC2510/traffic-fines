import { memo } from 'react';
import FineCard from '../FineCard/FineCard';
import type { FineListProps } from './FineList.types';

function FineList({ fines, selectedFineIds, affectedFineIds, onToggle, currentDate }: FineListProps) {
  if (fines.length === 0) {
    return <p className="text-center text-gray-400">No fines found.</p>;
  }

  return (
    <div role="list" aria-label="Traffic fines" className="flex flex-col gap-3">
      {fines.map((fine) => (
        <div role="listitem" key={fine.id}>
          <FineCard
            fine={fine}
            isSelected={selectedFineIds.has(fine.id)}
            hasValidationError={affectedFineIds.has(fine.id)}
            onToggle={onToggle}
            currentDate={currentDate}
          />
        </div>
      ))}
    </div>
  );
}

export default memo(FineList);
