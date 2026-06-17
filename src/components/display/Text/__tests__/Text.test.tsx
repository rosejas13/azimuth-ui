import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from '../Text';

describe('Text', () => {
  it('renders paragraph by default', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('P');
  });

  it('renders h1 for size h1', () => {
    render(<Text element={{ size: 'h1' }}>Heading</Text>);
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H1');
  });

  it('renders h2 for size h2', () => {
    render(<Text element={{ size: 'h2' }}>Heading</Text>);
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H2');
  });

  it('accepts custom element via as prop', () => {
    render(<Text element={{ as: 'span' }}>Span text</Text>);
    const el = screen.getByText('Span text');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Text className="custom">Text</Text>);
    const el = screen.getByText('Text');
    expect(el.className).toContain('custom');
  });

  it('passes through HTML attributes', () => {
    render(
      <Text id="my-text" data-testid="text">
        Text
      </Text>,
    );
    const el = screen.getByTestId('text');
    expect(el).toHaveAttribute('id', 'my-text');
  });

  it('renders all sizes', () => {
    const sizes = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'lg',
      'base',
      'sm',
      'xs',
    ] as const;
    for (const size of sizes) {
      const { unmount } = render(<Text element={{ size }}>text</Text>);
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

  it('renders all align values', () => {
    const aligns = ['left', 'center', 'right', 'justify'] as const;
    for (const align of aligns) {
      const { unmount } = render(<Text align={align}>text</Text>);
      expect(screen.getByText('text')).toBeInTheDocument();
      unmount();
    }
  });

  it('applies correct text-align class for each align value', () => {
    const el = render(<Text align="center">Centered</Text>);
    expect(screen.getByText('Centered').className).toMatch(/center/);
    el.unmount();

    const el2 = render(<Text align="right">Right</Text>);
    expect(screen.getByText('Right').className).toMatch(/right/);
    el2.unmount();

    const el3 = render(<Text align="justify">Justified</Text>);
    expect(screen.getByText('Justified').className).toMatch(/justify/);
    el3.unmount();

    const el4 = render(<Text align="left">Left</Text>);
    expect(screen.getByText('Left').className).toMatch(/left/);
    el4.unmount();
  });
});

describe('CSS structure', () => {
  it('applies the text CSS module class to the root element', () => {
    render(<Text>Content</Text>);
    const el = screen.getByText('Content');
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('text');
  });

  it('applies distinct class strings for each size variant', () => {
    const sizes = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'lg',
      'base',
      'sm',
      'xs',
    ] as const;
    const classStrings = new Set<string>();
    for (const size of sizes) {
      const { unmount } = render(<Text element={{ size }}>Content</Text>);
      classStrings.add(screen.getByText('Content').className);
      unmount();
    }
    expect(classStrings.size).toBe(sizes.length);
  });

  it('applies distinct class strings for each color variant', () => {
    const colors = ['primary', 'secondary', 'muted', 'accent'] as const;
    const classStrings = new Set<string>();
    for (const color of colors) {
      const { unmount } = render(<Text color={color}>Content</Text>);
      classStrings.add(screen.getByText('Content').className);
      unmount();
    }
    expect(classStrings.size).toBe(colors.length);
  });

  it('applies the uppercase CSS module class when uppercase prop is true', () => {
    render(<Text uppercase>UPPER</Text>);
    expect(screen.getByText('UPPER').className).toContain('uppercase');
  });

  it('applies the truncate CSS module class when truncate prop is true', () => {
    render(<Text truncate>Trunc</Text>);
    expect(screen.getByText('Trunc').className).toContain('truncate');
  });

  it('applies the nowrap CSS module class when nowrap prop is true', () => {
    render(<Text nowrap>NoWrap</Text>);
    expect(screen.getByText('NoWrap').className).toContain('nowrap');
  });

  it('applies weight CSS module classes', () => {
    const weights = ['bold', 'semibold', 'medium', 'normal', 'light'] as const;
    for (const weight of weights) {
      const { unmount } = render(<Text weight={weight}>W</Text>);
      expect(screen.getByText('W').className).toContain(weight);
      unmount();
    }
  });

  it('applies variant CSS module classes', () => {
    const variants = ['display', 'heading', 'body', 'mono'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Text element={{ variant }}>V</Text>);
      expect(screen.getByText('V').className).toContain(variant);
      unmount();
    }
  });
});
