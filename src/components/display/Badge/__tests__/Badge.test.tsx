import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = [
      'neutral',
      'primary',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });

  it('applies custom className', () => {
    render(<Badge className="my-badge">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('my-badge');
  });
});

describe('CSS structure', () => {
  it('applies the badge CSS module class to the root element', () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText('New');
    expect(el).toBeInstanceOf(HTMLSpanElement);
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('badge');
  });

  it('applies distinct class strings for each size variant', () => {
    const sizes = ['xs', 'sm', 'md'] as const;
    const classStrings = new Set<string>();
    for (const size of sizes) {
      const { unmount } = render(<Badge size={size}>B</Badge>);
      classStrings.add(screen.getByText('B').className);
      unmount();
    }
    expect(classStrings.size).toBe(sizes.length);
  });

  it('applies distinct class strings for each color variant', () => {
    const variants = [
      'neutral',
      'primary',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
    ] as const;
    const classStrings = new Set<string>();
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>B</Badge>);
      classStrings.add(screen.getByText('B').className);
      unmount();
    }
    expect(classStrings.size).toBe(variants.length);
  });
});
