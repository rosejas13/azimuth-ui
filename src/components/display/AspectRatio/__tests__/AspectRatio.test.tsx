import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { AspectRatio } from '../AspectRatio';

describe('AspectRatio', () => {
  it('renders children', () => {
    render(
      <AspectRatio>
        <div data-testid="child" />
      </AspectRatio>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies default 16/9 ratio', () => {
    const { container } = render(<AspectRatio>content</AspectRatio>);
    const root = container.firstElementChild;
    expect(root).toHaveStyle('--aspect-ratio: 1.7777777777777777');
  });

  it('applies custom 4/3 ratio', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>content</AspectRatio>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveStyle('--aspect-ratio: 1.3333333333333333');
  });

  it('applies 1/1 square ratio', () => {
    const { container } = render(<AspectRatio ratio={1}>content</AspectRatio>);
    const root = container.firstElementChild;
    expect(root).toHaveStyle('--aspect-ratio: 1');
  });

  it('sets maxWidth', () => {
    const { container } = render(
      <AspectRatio maxWidth="400px">content</AspectRatio>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveStyle('max-width: 400px');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref}>content</AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    const { container } = render(
      <AspectRatio className="custom">content</AspectRatio>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('custom');
  });

  it('computes correct padding-bottom value for ratio', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>content</AspectRatio>,
    );
    const root = container.firstElementChild;
    expect(root).toHaveStyle('--aspect-ratio-padding: 75%');
  });
});
