import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Column } from '../Column';

describe('Column', () => {
  it('renders children', () => {
    render(
      <Column>
        <span>First</span>
        <span>Second</span>
      </Column>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders in a div with vertical direction class', () => {
    const { container } = render(
      <Column>
        <span>A</span>
      </Column>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(container.firstChild).toHaveClass('column');
  });

  it('applies gapSm when gap is sm', () => {
    const { container } = render(
      <Column gap="sm">
        <span>A</span>
      </Column>,
    );
    expect(container.firstChild).toHaveClass('gapSm');
  });

  it('applies gapMd by default', () => {
    const { container } = render(
      <Column>
        <span>A</span>
      </Column>,
    );
    expect(container.firstChild).toHaveClass('gapMd');
  });

  it('applies align variant CSS classes', () => {
    const aligns = ['start', 'center', 'end', 'stretch'] as const;
    for (const align of aligns) {
      const { container, unmount } = render(
        <Column align={align}>
          <span>A</span>
        </Column>,
      );
      const expectedClass = `align${align.charAt(0).toUpperCase() + align.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies justify variant CSS classes', () => {
    const justifies = ['start', 'center', 'end', 'between', 'around'] as const;
    for (const justify of justifies) {
      const { container, unmount } = render(
        <Column justify={justify}>
          <span>A</span>
        </Column>,
      );
      const expectedClass = `justify${justify.charAt(0).toUpperCase() + justify.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies gap variant CSS classes', () => {
    const gaps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    for (const gap of gaps) {
      const { container, unmount } = render(
        <Column gap={gap}>
          <span>A</span>
        </Column>,
      );
      const expectedClass = `gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies custom className and forwards native props', () => {
    const { container } = render(
      <Column className="my-column" data-testid="column" aria-label="details">
        <span>A</span>
      </Column>,
    );
    expect(container.firstChild).toHaveClass('my-column');
    expect(screen.getByTestId('column')).toHaveAttribute(
      'aria-label',
      'details',
    );
  });
});
