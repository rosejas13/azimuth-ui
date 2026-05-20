import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders paragraph by default', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('P');
  });

  it('renders h1 for size h1', () => {
    render(<Text size="h1">Heading</Text>);
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H1');
  });

  it('renders h2 for size h2', () => {
    render(<Text size="h2">Heading</Text>);
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H2');
  });

  it('accepts custom element via as prop', () => {
    render(<Text as="span">Span text</Text>);
    const el = screen.getByText('Span text');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Text className="custom">Text</Text>);
    const el = screen.getByText('Text');
    expect(el.className).toContain('custom');
  });

  it('passes through HTML attributes', () => {
    render(<Text id="my-text" data-testid="text">Text</Text>);
    const el = screen.getByTestId('text');
    expect(el).toHaveAttribute('id', 'my-text');
  });

  it('renders all sizes', () => {
    const sizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'lg', 'base', 'sm', 'xs'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Text size={size}>text</Text>);
      expect(screen.getByText('text')).toBeInTheDocument();
      unmount();
    }
  });

  it('renders all color variants', () => {
    const colors = ['primary', 'secondary', 'muted', 'accent'] as const;
    for (const color of colors) {
      const { unmount } = render(<Text color={color}>text</Text>);
      expect(screen.getByText('text')).toBeInTheDocument();
      unmount();
    }
  });
});
