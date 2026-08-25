import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Box } from '../Box';

describe('Box', () => {
  it('renders a div by default', () => {
    const { container } = render(<Box>Content</Box>);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the element specified by `as`', () => {
    const { container } = render(
      <Box as="section">
        <span>A</span>
      </Box>,
    );
    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });

  it('applies padding variant CSS classes', () => {
    const spacings = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    for (const spacing of spacings) {
      const { container, unmount } = render(<Box padding={spacing}>A</Box>);
      const expectedClass = `padding${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies paddingX and paddingY classes', () => {
    const { container } = render(
      <Box paddingX="sm" paddingY="lg">
        A
      </Box>,
    );
    expect(container.firstChild).toHaveClass('paddingXSm');
    expect(container.firstChild).toHaveClass('paddingYLg');
  });

  it('applies border class when border is true', () => {
    const { container } = render(<Box border>A</Box>);
    expect(container.firstChild).toHaveClass('border');
  });

  it('does not apply border class by default', () => {
    const { container } = render(<Box>A</Box>);
    expect(container.firstChild).not.toHaveClass('border');
  });

  it('applies radius variant CSS classes', () => {
    const radii = ['none', 'sm', 'md', 'lg', 'full'] as const;
    for (const radius of radii) {
      const { container, unmount } = render(<Box radius={radius}>A</Box>);
      const expectedClass = `radius${radius.charAt(0).toUpperCase() + radius.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('applies background variant CSS classes', () => {
    const { container: surface } = render(<Box background="surface">A</Box>);
    expect(surface.firstChild).toHaveClass('bgSurface');
    const { container: subtle } = render(<Box background="subtle">A</Box>);
    expect(subtle.firstChild).toHaveClass('bgSubtle');
  });

  it('applies shadow variant CSS classes', () => {
    const shadows = ['sm', 'md', 'lg', 'xl'] as const;
    for (const shadow of shadows) {
      const { container, unmount } = render(<Box shadow={shadow}>A</Box>);
      const expectedClass = `shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`;
      expect(container.firstChild).toHaveClass(expectedClass);
      unmount();
    }
  });

  it('renders an unstyled element with no visual classes by default', () => {
    const { container } = render(<Box>A</Box>);
    const box = container.firstChild as HTMLElement;
    expect(box.className).toBe('');
    expect(box).not.toHaveClass('paddingLg');
    expect(box).not.toHaveClass('border');
    expect(box).not.toHaveClass('bgSurface');
    expect(box).not.toHaveClass('shadowMd');
  });

  it('applies custom className', () => {
    const { container } = render(<Box className="my-box">A</Box>);
    expect(container.firstChild).toHaveClass('my-box');
  });

  it('spreads native props onto the rendered element', () => {
    render(
      <Box id="panel" data-testid="box-panel" onClick={() => undefined}>
        A
      </Box>,
    );
    const box = screen.getByTestId('box-panel');
    expect(box).toHaveAttribute('id', 'panel');
  });
});
