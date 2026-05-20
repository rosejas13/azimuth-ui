import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders as status role', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Loader label="Loading..." />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('renders bar variant', () => {
    render(<Loader variant="bar" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Loader className="my-loader" />);
    expect(screen.getByRole('status')).toHaveClass('my-loader');
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Loader size={size} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      unmount();
    }
  });
});
