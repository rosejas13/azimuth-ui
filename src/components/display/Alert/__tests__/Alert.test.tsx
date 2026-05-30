import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from '../Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Alert title="Notice" />);
    expect(screen.getByText('Notice')).toBeInTheDocument();
  });

  it('renders all variants without error', () => {
    const variants = [
      'warning',
      'caution',
      'alert',
      'success',
      'info',
      'notification',
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<Alert variant={variant}>{variant}</Alert>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });

  it('uses role="alert" for warning variant', () => {
    render(<Alert variant="warning">Warning!</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role="status" for info variant', () => {
    render(<Alert variant="info">Info</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses role="status" for notification variant', () => {
    render(<Alert variant="notification">Note</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses aria-live="assertive" for alert variant', () => {
    render(<Alert variant="alert">Error!</Alert>);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses aria-live="polite" for info variant', () => {
    render(<Alert variant="info">Info</Alert>);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('shows dismiss button when dismissible', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Dismiss me
      </Alert>,
    );
    const btn = screen.getByRole('button', { name: 'Dismiss' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    await new Promise((r) => setTimeout(r, 250));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides dismiss button when not dismissible', () => {
    render(<Alert>No dismiss</Alert>);
    expect(
      screen.queryByRole('button', { name: 'Dismiss' }),
    ).not.toBeInTheDocument();
  });

  it('fires autoDismiss after timeout', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Alert autoDismiss={5000} onDismiss={onDismiss}>
        Auto dismiss
      </Alert>,
    );
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('clears autoDismiss timer on unmount', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { unmount } = render(
      <Alert autoDismiss={5000} onDismiss={onDismiss}>
        Auto dismiss
      </Alert>,
    );
    unmount();
    vi.advanceTimersByTime(5000);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('applies custom className', () => {
    render(<Alert className="my-alert">Test</Alert>);
    const el = screen.getByText('Test').closest('[role="status"]');
    expect(el).toHaveClass('my-alert');
  });

  it('shows icon by default', () => {
    render(<Alert variant="success">Done</Alert>);
    const icon = document.querySelector('[class*="icon"]');
    expect(icon?.querySelector('svg')).toBeInTheDocument();
  });

  it('hides icon when icon=null', () => {
    render(
      <Alert variant="success" icon={null}>
        Done
      </Alert>,
    );
    const icon = document.querySelector('[class*="icon"]');
    expect(icon).not.toBeInTheDocument();
  });
});
