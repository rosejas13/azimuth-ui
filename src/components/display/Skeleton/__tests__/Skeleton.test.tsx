import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a skeleton element', () => {
    render(<Skeleton />);
    const items = screen.getAllByRole('status');
    expect(items).toHaveLength(1);
  });

  it('has aria-label "Loading"', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders the specified count', () => {
    render(<Skeleton count={4} />);
    expect(screen.getAllByRole('status')).toHaveLength(4);
  });

  it('applies custom className', () => {
    render(<Skeleton className="my-class" />);
    expect(screen.getByRole('status')).toHaveClass('my-class');
  });

  it('renders text variant by default', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toHaveClass('text');
  });

  it('renders circle variant', () => {
    render(<Skeleton variant="circle" />);
    expect(screen.getByRole('status')).toHaveClass('circle');
  });

  it('renders rect variant', () => {
    render(<Skeleton variant="rect" />);
    expect(screen.getByRole('status')).toHaveClass('rect');
  });

  it('applies custom width and height', () => {
    render(<Skeleton width="300px" height="20px" />);
    const el = screen.getByRole('status');
    expect(el).toHaveStyle({ width: '300px', height: '20px' });
  });
});
