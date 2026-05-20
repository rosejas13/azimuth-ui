import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders children', () => {
    render(
      <Icon>
        <svg data-testid="svg" />
      </Icon>,
    );
    expect(screen.getByTestId('svg')).toBeInTheDocument();
  });

  it('is aria-hidden by default', () => {
    render(
      <Icon>
        <svg data-testid="svg" />
      </Icon>,
    );
    expect(screen.getByTestId('svg').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('applies custom className', () => {
    render(
      <Icon className="my-icon">
        <svg data-testid="svg" />
      </Icon>,
    );
    expect(screen.getByTestId('svg').parentElement?.className).toContain(
      'my-icon',
    );
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'xl2'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(
        <Icon size={size}>
          <svg />
        </Icon>,
      );
      expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
      unmount();
    }
  });
});
