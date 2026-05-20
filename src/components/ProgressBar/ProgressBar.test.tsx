import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

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
});
