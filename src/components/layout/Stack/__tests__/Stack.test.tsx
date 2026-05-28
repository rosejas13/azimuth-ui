import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from '../Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <span>First</span>
        <span>Second</span>
      </Stack>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders vertically by default', () => {
    const { container } = render(
      <Stack>
        <span>A</span>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('vertical');
  });

  it('renders horizontally', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <span>A</span>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('horizontal');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Stack className="my-stack">
        <span>A</span>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('my-stack');
  });

  it('accepts alignment', () => {
    const aligns = ['start', 'center', 'end', 'stretch'] as const;
    for (const align of aligns) {
      const { container, unmount } = render(
        <Stack align={align}>
          <span>A</span>
        </Stack>,
      );
      expect(container.firstElementChild?.className).toContain('align');
      unmount();
    }
  });
});
