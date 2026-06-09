import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  it('renders title and price', () => {
    render(<ProductCard title="Test Product" price="$29.99" />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ProductCard title="Test" price="$10" description="A great product" />,
    );
    expect(screen.getByText('A great product')).toBeInTheDocument();
  });

  it('renders badge text', () => {
    render(<ProductCard title="Test" price="$10" badge="Sale" />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('shows out of stock state', () => {
    render(<ProductCard title="Test" price="$10" outOfStock />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });

  it('calls onCtaClick when CTA is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ProductCard title="Test" price="$10" onCtaClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('shows originalPrice', () => {
    render(<ProductCard title="Test" price="$10" originalPrice="$20" />);
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('renders rating stars', () => {
    render(<ProductCard title="Test" price="$10" rating={4} />);
    const stars = screen.getByRole('img', { name: /out of 5 stars/i });
    expect(stars).toBeInTheDocument();
  });

  it('renders review count with rating', () => {
    render(
      <ProductCard title="Test" price="$10" rating={4} reviewCount={42} />,
    );
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProductCard title="Test" price="$10" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders image when provided', () => {
    render(
      <ProductCard
        title="Test"
        price="$10"
        image="/test.jpg"
        imageAlt="Test image"
      />,
    );
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('uses custom CTA label', () => {
    render(<ProductCard title="Test" price="$10" ctaLabel="Buy Now" />);
    expect(screen.getByRole('button', { name: 'Buy Now' })).toBeInTheDocument();
  });
});
