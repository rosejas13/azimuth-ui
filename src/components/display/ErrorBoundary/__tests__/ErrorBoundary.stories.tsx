import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Button } from '@/components/input/Button';

function ThrowExample(): never {
  throw new Error('Something went wrong while rendering this component.');
}

function SafeContent() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Dashboard Content</h2>
      <p>This content is rendering normally inside the error boundary.</p>
    </div>
  );
}

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <SafeContent />
    </ErrorBoundary>
  ),
};

export const ErrorStateDefault: Story = {
  render: () => (
    <ErrorBoundary>
      <ThrowExample />
    </ErrorBoundary>
  ),
};

export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2>Custom Error UI</h2>
          <p style={{ color: '#666' }}>{error.message}</p>
          <Button onClick={reset}>Retry</Button>
        </div>
      )}
    >
      <ThrowExample />
    </ErrorBoundary>
  ),
};
