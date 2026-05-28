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

  it('applies justify variant CSS classes', () => {
    const justifies = ['start', 'center', 'end', 'between', 'around'] as const;
    for (const justify of justifies) {
      const { container, unmount } = render(<Stack justify={justify}><span>A</span></Stack>);
      const expectedClass = `justify${justify.charAt(0).toUpperCase() + justify.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies spacing variant CSS classes', () => {
    const spacings = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    for (const spacing of spacings) {
      const { container, unmount } = render(<Stack spacing={spacing}><span>A</span></Stack>);
      const expectedClass = `gap${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies wrap class when wrap is true', () => {
    const { container } = render(<Stack wrap><span>A</span><span>B</span></Stack>);
    expect(container.firstChild).toHaveClass('wrap');
  });

  it('does not apply wrap class by default', () => {
    const { container } = render(<Stack><span>A</span></Stack>);
    expect(container.firstChild).not.toHaveClass('wrap');
  });
});
