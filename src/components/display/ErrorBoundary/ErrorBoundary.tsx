'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPage } from '../ErrorPage';
import { cn } from '@/utils/cn';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/** Props for the ErrorBoundary component. */
export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI — rendered when an error is caught. Can be a ReactNode or a function receiving (error, reset). */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called when an error is caught. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Additional className for the fallback wrapper. */
  className?: string;
}

/** React error boundary that catches render errors and displays a fallback UI. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback, className } = this.props;
      const error = this.state.error!;

      if (typeof fallback === 'function') {
        return (
          <div className={cn(styles.root, className)}>
            {fallback(error, this.handleReset)}
          </div>
        );
      }

      if (fallback != null) {
        return <div className={cn(styles.root, className)}>{fallback}</div>;
      }

      return (
        <div className={cn(styles.root, className)}>
          <ErrorPage
            status={500}
            title="Something went wrong"
            description={error.message || 'An unexpected error occurred.'}
            action={
              <button type="button" onClick={this.handleReset}>
                Try again
              </button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
