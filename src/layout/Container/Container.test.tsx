import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './Container';

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
});
