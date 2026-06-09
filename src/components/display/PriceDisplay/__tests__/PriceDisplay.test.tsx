import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PriceDisplay } from '../PriceDisplay';

describe('PriceDisplay', () => {
  it('renders price with default currency', () => {
    render(<PriceDisplay price={29.99} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders original price', () => {
    render(<PriceDisplay price={19.99} originalPrice={39.99} />);
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
  });

  it('shows suffix when provided', () => {
    render(<PriceDisplay price={10} suffix="/mo" />);
    expect(screen.getByText('/mo')).toBeInTheDocument();
  });

  it('renders without suffix', () => {
    render(<PriceDisplay price={10} />);
    expect(screen.queryByText('/mo')).not.toBeInTheDocument();
  });

  it('handles zero price', () => {
    render(<PriceDisplay price={0} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<PriceDisplay price={10} size={size} />);
      expect(screen.getByText('$10')).toBeInTheDocument();
      unmount();
    }
  });

  it('applies custom className', () => {
    const { container } = render(
      <PriceDisplay price={10} className="custom" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('formats decimal prices with two digits', () => {
    render(<PriceDisplay price={9.5} />);
    expect(screen.getByText('$9.50')).toBeInTheDocument();
  });

  it('renders with custom currency symbol', () => {
    render(<PriceDisplay price={10} currency="€" />);
    expect(screen.getByText('€10')).toBeInTheDocument();
  });
});
