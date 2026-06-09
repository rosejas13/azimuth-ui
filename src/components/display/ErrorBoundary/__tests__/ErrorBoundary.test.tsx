import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

function ThrowError({ message }: { message: string }): never {
  throw new Error(message);
}

function GoodChild() {
  return <div>All good</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('catches error and renders default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Something broke" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Something broke/)).toBeInTheDocument();
  });

  it('calls onError when error is caught', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError message="Test error" />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it('renders custom fallback ReactNode', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError message="Test error" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('renders custom fallback function with error and reset', () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <span>Error: {error.message}</span>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      >
        <ThrowError message="Custom error" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Error: Custom error')).toBeInTheDocument();
  });

  it('reset function is callable and re-renders fallback', async () => {
    render(
      <ErrorBoundary
        fallback={(_error, reset) => (
          <div>
            <span>Error occurred</span>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      >
        <ThrowError message="Test" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Reset'));

    // After reset, children re-render and throw again, re-caught
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('applies className to fallback wrapper', () => {
    const { container } = render(
      <ErrorBoundary className="my-boundary">
        <ThrowError message="Test" />
      </ErrorBoundary>,
    );
    expect(container.firstChild).toHaveClass('my-boundary');
  });

  it('displays error message in default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Specific error message" />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Specific error message')).toBeInTheDocument();
  });

  it('default fallback has a try again button', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Boom" />
      </ErrorBoundary>,
    );
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });
});
