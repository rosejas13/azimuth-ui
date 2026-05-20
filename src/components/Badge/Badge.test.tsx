import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
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
