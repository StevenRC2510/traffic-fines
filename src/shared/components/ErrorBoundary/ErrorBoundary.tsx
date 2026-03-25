import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="max-w-[600px] mx-auto mt-10 p-6 text-center bg-error-bg border border-error-border rounded-lg text-error-text font-sans"
        >
          <h2 className="mt-0 text-xl">Something went wrong</h2>
          <p className="text-sm mb-4">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={this.handleReset}
            className="
              py-2 px-5 text-sm bg-error-text text-white border-none rounded cursor-pointer
              hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-text
              active:opacity-80
            "
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
