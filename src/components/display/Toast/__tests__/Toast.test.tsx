import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toast } from '../Toast';

describe('Toast', () => {
  it('renders title', () => {
    render(<Toast content={{ title: 'Saved!' }} />);
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders message', () => {
    render(<Toast content={{ title: 'Saved!', message: 'Your changes have been saved.' }} />);
    expect(
      screen.getByText('Your changes have been saved.'),
    ).toBeInTheDocument();
  });

  it('renders all variants without error', () => {
    const variants = ['warning', 'success', 'error', 'info'] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <Toast content={{ variant, title: variant }} />,
      );
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });

  it('has role="status"', () => {
    render(<Toast content={{ title: 'Status' }} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<Toast content={{ title: 'Polite' }} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('renders dismiss button when dismissible', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Toast content={{ title: 'Toast' }} dismiss={{ dismissible: true, onDismiss }} />);
    const btn = screen.getByRole('button', { name: 'Dismiss' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hide dismiss button when not dismissible', () => {
    render(<Toast content={{ title: 'Toast' }} />);
    expect(
      screen.queryByRole('button', { name: 'Dismiss' }),
    ).not.toBeInTheDocument();
  });

  it('fires autoDismiss after timeout', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Toast content={{ title: 'Toast' }} dismiss={{ autoDismiss: 3000, onDismiss }} />,
    );
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('clears autoDismiss timer on unmount', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { unmount } = render(
      <Toast content={{ title: 'Toast' }} dismiss={{ autoDismiss: 3000, onDismiss }} />,
    );
    unmount();
    vi.advanceTimersByTime(3000);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('renders expand button when expandable', () => {
    render(<Toast content={{ title: 'Toast' }} expandable />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('expands and shows children on click', async () => {
    const user = userEvent.setup();
    render(
      <Toast content={{ title: 'Toast' }} expandable>
        Extra details
      </Toast>,
    );
    const btn = screen.getByText('Show more');
    await user.click(btn);
    expect(screen.getByText('Extra details')).toBeInTheDocument();
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('toggles expand aria-expanded', async () => {
    const user = userEvent.setup();
    render(
      <Toast content={{ title: 'Toast' }} expandable>
        Details
      </Toast>,
    );
    const btn = screen.getByText('Show more');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies custom className', () => {
    render(<Toast content={{ title: 'Toast' }} className="my-toast" />);
    expect(screen.getByRole('status')).toHaveClass('my-toast');
  });
});
