import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText('Hidden text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<VisuallyHidden className="my-vh">Content</VisuallyHidden>);
    expect(screen.getByText('Content')).toHaveClass('my-vh');
  });

  it('renders a span element', () => {
    render(<VisuallyHidden>Test</VisuallyHidden>);
    const el = screen.getByText('Test');
    expect(el.tagName).toBe('SPAN');
  });

  it('passes additional props', () => {
    render(<VisuallyHidden data-testid="vh">Hidden</VisuallyHidden>);
    expect(screen.getByTestId('vh')).toBeInTheDocument();
  });
});
