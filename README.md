# Traffic Fines Payment Selection

A React application for selecting and managing traffic fines with dynamic payment calculation, business rule validation, and discount logic.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start the development server       |
| `npm run build`    | Type-check and build for production|
| `npm run preview`  | Preview the production build       |
| `npm test`         | Run unit tests with Vitest         |
| `npm run test:e2e` | Run Playwright end-to-end tests    |

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- Vitest for unit testing
- Playwright for E2E testing

## Project Structure

```
src/
  app/              # Providers, config
  features/         # Feature modules
    fines-selection/
      components/   # Each component in its own folder
        FineCard/
          FineCard.tsx
          FineCard.types.ts
          FineCard.utils.ts
          FineCard.constants.ts
        FineList/
        PaymentSummary/
        ContinueButton/
        ConfirmationDialog/
      hooks/        # Each hook in its own folder, barrel export (index.ts)
        useFines/
        useFineSelection/
        usePaymentSummary/
        useSelectionValidation/
        useAffectedFines/
        useConfirmationDialog/
      schemas/      # Validation logic (dependency rule, incompatibility rule)
      utils/        # Pure discount calculation functions
      types/        # Feature-specific types
      pages/        # Page-level container component
  shared/           # Shared types, utils, constants, components
    components/
      ErrorBoundary/
  infrastructure/   # API layer, adapters, mock data
  tests/            # E2E and unit tests
```

## Architecture Decisions

### Feature-Based Structure

I organized the code around features rather than technical layers. Everything related to fine selection lives under `src/features/fines-selection/`, while truly shared utilities, types, and constants live in `src/shared/`. This keeps the codebase navigable — you don't need to jump between six different top-level folders to understand a single feature.

The infrastructure layer (`src/infrastructure/`) handles API communication, data mapping, and mock data, keeping the feature code decoupled from backend response shapes.

### Business Logic Implementation

The five business rules are split by concern:

- **Rules A and B** (early payment discount and volume discount) are pure calculation functions in `utils/discount.utils.ts`. They take a fine and a current date, return a number. No side effects, straightforward to test.
- **Rule C** (license fine exclusion from volume discount) is handled inside the volume discount calculation — license fines count toward the 3-fine threshold but their subtotal is excluded from the 5% discount base.
- **Rules D and E** (dependency and incompatibility validation) live in `schemas/selection.schema.ts` as validation functions that return error objects. The UI consumes these through `useSelectionValidation`.

I inject `currentDate` as a parameter everywhere instead of calling `new Date()` internally. This makes the discount and date logic deterministic and testable without mocking globals.

### State Management

React Query handles server state (fetching fines, caching, retry logic). Local UI state (which fines are selected) is managed with a simple `useState` + `Set<string>` in `useFineSelection`. The payment summary is derived state computed via `useMemo` from the selected fines — no separate store needed.

I avoided Redux or Zustand because the state graph is simple: fines come from the server, selection is local, and everything else derives from those two. Adding a state management library would be overhead without benefit at this scale.

### Adapter Pattern

API responses are mapped to domain types through `infrastructure/adapters/fine.adapter.ts` before reaching the UI. The feature code works with `Date` objects, typed categories, and computed fields like `expiryStatus` — without worrying about raw string dates or unvalidated category values from the backend. If the API shape changes, only the adapter needs updating.

### Confirmation Dialog

The continue action opens a native HTML `<dialog>` modal showing the payment summary before confirming. This uses the browser's built-in modal behavior (backdrop, focus trapping, escape key) without needing a third-party modal library.

### Date Handling

All date comparisons use UTC to avoid timezone and DST drift. The `daysUntilDue` function strips time components and works purely with calendar days. This is critical for the early payment discount (10-day threshold) and severely overdue classification (30+ days past due).

## Testing

### Unit Tests (34 tests)

Pure functions are covered with Vitest:
- Date utilities: `daysUntilDue`, `classifyExpiryStatus` with boundary cases
- Discount calculations: early payment, volume discount, license exclusion
- Validation schemas: dependency rule, incompatibility rule, combined rules

### E2E Tests (14 tests)

Playwright tests cover the full user flow:
- Page load and fine display
- Selection/deselection with summary recalculation
- Volume discount triggering at 3+ fines
- License dependency validation
- Incompatibility rule between severely overdue and not-expired fines
- Keyboard navigation (Enter/Space)
- Confirmation dialog flow
- Loading state

All E2E tests use `page.clock` to fix the date, ensuring deterministic results.

## What I'd Improve With More Time

- **Accessibility audit**: The current implementation handles keyboard navigation and ARIA attributes, but a full screen reader walkthrough would likely reveal improvements.
- **Animations**: Subtle transitions when selecting/deselecting fines and when the payment summary recalculates would improve the experience.
- **Internationalization**: Dates and currency are formatted for en-US. Extracting these into a locale-aware formatting layer would prepare the app for other markets.
- **Error recovery**: The current error state shows a reload prompt. More granular retry logic with exponential backoff surfaced to the user would be more robust.
- **Pagination / virtualization**: With 4 fines this isn't needed, but a real system could have hundreds. A virtualized list would be necessary at scale.
