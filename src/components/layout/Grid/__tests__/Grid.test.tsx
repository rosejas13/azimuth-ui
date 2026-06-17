import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid } from '../Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <span>A</span>
        <span>B</span>
      </Grid>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="my-grid">
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass('my-grid');
  });

  it('accepts column count', () => {
    const { container } = render(
      <Grid cols={2}>
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass('cols2');
  });

  it('defaults to auto-fit columns', () => {
    const { container } = render(
      <Grid>
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass('colsAuto');
  });

  it('applies custom minWidth as number via inline style', () => {
    const { container } = render(
      <Grid minWidth={300}>
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).not.toHaveClass('colsAuto');
    expect(container.firstChild).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    });
  });

  it('applies custom minWidth as string via inline style', () => {
    const { container } = render(
      <Grid minWidth="280px">
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).not.toHaveClass('colsAuto');
    expect(container.firstChild).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    });
  });

  it('applies custom gap via style', () => {
    const { container } = render(
      <Grid gap="xl">
        <span>A</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveStyle({
      gap: 'var(--azimuth-space-xl)',
    });
  });

  it('applies align variant CSS classes', () => {
    const aligns = ['start', 'center', 'end', 'stretch'] as const;
    for (const align of aligns) {
      const { container, unmount } = render(
        <Grid align={align}>
          <span>A</span>
        </Grid>,
      );
      expect(container.firstChild).toHaveClass(
        `align${align.charAt(0).toUpperCase() + align.slice(1)}`,
      );
      unmount();
    }
  });

  it('applies highlight variant CSS class', () => {
    const { container } = render(
      <Grid variant="highlight">
        <span>A</span>
        <span>B</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass('highlight');
  });

  it('applies sidebar variant CSS class', () => {
    const { container } = render(
      <Grid variant="sidebar">
        <span>A</span>
        <span>B</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass('sidebar');
  });
});

describe('CSS structure', () => {
  it('applies the grid CSS module class to the root element', () => {
    const { container } = render(
      <Grid>
        <span>A</span>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('grid');
  });

  it('applies distinct class strings for each column count', () => {
    const cols = [1, 2, 3, 4, 5, 6] as const;
    const classStrings = new Set<string>();
    for (const colCount of cols) {
      const { container, unmount } = render(
        <Grid cols={colCount}>
          <span>A</span>
        </Grid>,
      );
      classStrings.add((container.firstChild as HTMLElement).className);
      unmount();
    }
    expect(classStrings.size).toBe(cols.length);
  });

  it('applies the responsive CSS module class when responsive cols are used', () => {
    const { container } = render(
      <Grid cols={{ base: 1, md: 2 }}>
        <span>A</span>
      </Grid>,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      'responsive',
    );
  });

  it('applies highlight and sidebar variant CSS module classes', () => {
    const { container: hc } = render(
      <Grid variant="highlight">
        <span>A</span>
      </Grid>,
    );
    expect((hc.firstChild as HTMLElement).className).toContain('highlight');

    const { container: sc } = render(
      <Grid variant="sidebar">
        <span>A</span>
        <span>B</span>
      </Grid>,
    );
    expect((sc.firstChild as HTMLElement).className).toContain('sidebar');
  });

  it('applies CSS custom properties for each responsive breakpoint', () => {
    const { container } = render(
      <Grid cols={{ base: 1, md: 2, lg: 3 }}>
        <span>A</span>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue('--grid-cols-base')).toBe(
      'repeat(1, 1fr)',
    );
    expect(el.style.getPropertyValue('--grid-cols-md')).toBe('repeat(2, 1fr)');
    expect(el.style.getPropertyValue('--grid-cols-lg')).toBe('repeat(3, 1fr)');
  });
});
