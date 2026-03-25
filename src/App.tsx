import { QueryProvider } from './app/providers/QueryProvider';
import ErrorBoundary from './shared/components/ErrorBoundary/ErrorBoundary';
import { FineSelectionPage } from './features/fines-selection';

function App() {
  return (
    <QueryProvider>
      <ErrorBoundary>
        <FineSelectionPage />
      </ErrorBoundary>
    </QueryProvider>
  );
}

export default App;
