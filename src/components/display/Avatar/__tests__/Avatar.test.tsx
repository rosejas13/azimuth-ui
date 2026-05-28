import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders with fallback initials', () => {
    render(<Avatar fallback="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders one initial for single name', () => {
    render(<Avatar fallback="Admin" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('has img role', () => {
    render(<Avatar fallback="JD" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Avatar fallback="JD" className="my-avatar" />);
    expect(screen.getByRole('img')).toHaveClass('my-avatar');
  });

  it('renders all sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Avatar fallback="A" size={size} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      unmount();
    }
  });

  it('renders square variant', () => {
    render(<Avatar fallback="SQ" square />);
    expect(screen.getByRole('img')).toHaveClass('square');
  });
});
