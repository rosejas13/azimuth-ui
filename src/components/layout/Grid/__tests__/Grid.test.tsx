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
      const { container, unmount } = render(<Grid align={align}><span>A</span></Grid>);
      expect(container.firstChild).toHaveClass(`align${align.charAt(0).toUpperCase() + align.slice(1)}`);
      unmount();
    }
  });

  it('applies highlight variant CSS class', () => {
    const { container } = render(<Grid variant="highlight"><span>A</span><span>B</span></Grid>);
    expect(container.firstChild).toHaveClass('highlight');
  });

  it('applies sidebar variant CSS class', () => {
    const { container } = render(<Grid variant="sidebar"><span>A</span><span>B</span></Grid>);
    expect(container.firstChild).toHaveClass('sidebar');
  });
});
