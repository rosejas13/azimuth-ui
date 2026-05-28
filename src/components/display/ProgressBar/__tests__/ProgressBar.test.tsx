import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders progressbar role', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow', () => {
    render(<ProgressBar value={75} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '75');
    expect(bar).toHaveAttribute('aria-valuetext', '75%');
  });

  it('handles indeterminate', () => {
    render(<ProgressBar indeterminate />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('clamps value between 0 and max', () => {
    const { rerender } = render(<ProgressBar value={150} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100%');
    rerender(<ProgressBar value={-10} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0%');
  });

  it('applies custom className', () => {
    render(<ProgressBar value={50} className="my-bar" />);
    expect(screen.getByRole('progressbar')).toHaveClass('my-bar');
  });

  it('applies color variant CSS classes', () => {
    const colors = ['success', 'warning', 'danger', 'accent'] as const;
    for (const color of colors) {
      const { unmount } = render(<ProgressBar value={50} color={color} />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveClass(color);
      unmount();
    }
  });

  it('applies size variant CSS classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<ProgressBar value={50} size={size} />);
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveClass(size);
      unmount();
    }
  });

  it('renders percentage when showPercentage is true', () => {
    render(<ProgressBar value={75} showPercentage />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('does not render percentage by default', () => {
    render(<ProgressBar value={50} />);
    expect(screen.queryByText(/%/)).toBeNull();
  });
});
