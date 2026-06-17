import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from '../Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello</Container>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom">Content</Container>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders as a div', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('defaults to lg size', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toHaveClass('lg');
  });

  it('applies sm size class', () => {
    const { container } = render(<Container size="sm">Content</Container>);
    expect(container.firstChild).toHaveClass('sm');
  });

  it('applies xl size class', () => {
    const { container } = render(<Container size="xl">Content</Container>);
    expect(container.firstChild).toHaveClass('xl');
  });

  it('applies full size class', () => {
    const { container } = render(<Container size="full">Content</Container>);
    expect(container.firstChild).toHaveClass('full');
  });

  it('renders maxWidth as number (px)', () => {
    const { container } = render(<Container maxWidth={960}>Content</Container>);
    expect(container.firstChild).toHaveStyle({ maxWidth: '960px' });
  });

  it('renders maxWidth as string (rem)', () => {
    const { container } = render(
      <Container maxWidth="60rem">Content</Container>,
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: '60rem' });
  });

  it('maxWidth overrides size prop', () => {
    const { container } = render(
      <Container size="sm" maxWidth={1200}>
        Content
      </Container>,
    );
    expect(container.firstChild).toHaveClass('sm');
    expect(container.firstChild).toHaveStyle({ maxWidth: '1200px' });
  });
});

describe('CSS structure', () => {
  it('applies the container CSS module class to the root element', () => {
    const { container } = render(<Container>Content</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('container');
  });

  it('applies distinct class strings for each size variant', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    const classStrings = new Set<string>();
    for (const size of sizes) {
      const { container, unmount } = render(
        <Container size={size}>Content</Container>,
      );
      classStrings.add((container.firstChild as HTMLElement).className);
      unmount();
    }
    expect(classStrings.size).toBe(sizes.length);
  });
});
