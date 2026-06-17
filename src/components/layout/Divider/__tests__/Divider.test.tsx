import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from '../Divider';

describe('Divider', () => {
  it('renders separator role', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('has horizontal orientation by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
  });

  it('has vertical orientation', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('applies custom className', () => {
    render(<Divider className="my-divider" />);
    expect(screen.getByRole('separator')).toHaveClass('my-divider');
  });

  it('has no margin inline style by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).not.toHaveAttribute('style');
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'renders with margin="%s"',
    (margin) => {
      render(<Divider margin={margin} />);
      expect(screen.getByRole('separator')).toHaveAttribute(
        'style',
        `margin: var(--azimuth-space-${margin});`,
      );
    },
  );

  it('merges margin with custom style', () => {
    render(<Divider margin="sm" style={{ color: 'red' }} />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute(
      'style',
      'margin: var(--azimuth-space-sm); color: red;',
    );
  });
});

describe('CSS structure', () => {
  it('applies the divider CSS module class to the root element', () => {
    render(<Divider />);
    const el = screen.getByRole('separator');
    expect(el).toBeInstanceOf(HTMLHRElement);
    expect(el.classList.length).toBeGreaterThan(0);
    expect(el.className).toContain('divider');
  });

  it('applies distinct class strings for horizontal and vertical orientations', () => {
    const { container: hContainer } = render(
      <Divider orientation="horizontal" />,
    );
    const { container: vContainer } = render(
      <Divider orientation="vertical" />,
    );
    expect((hContainer.firstChild as HTMLElement).className).not.toBe(
      (vContainer.firstChild as HTMLElement).className,
    );
  });
});
