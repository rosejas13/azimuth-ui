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
});
