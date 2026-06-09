import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { ScrollArea } from '../ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('applies vertical orientation class by default', () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('vertical');
  });

  it('applies horizontal orientation class', () => {
    const { container } = render(
      <ScrollArea orientation="horizontal">
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('horizontal');
  });

  it('applies both orientation class', () => {
    const { container } = render(
      <ScrollArea orientation="both">
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('both');
  });

  it('toggles hideScrollbar class', () => {
    const { container, rerender } = render(
      <ScrollArea hideScrollbar>
        <p>Content</p>
      </ScrollArea>,
    );
    let el = container.firstChild as HTMLElement;
    expect(el.className).toContain('hideScrollbar');

    rerender(
      <ScrollArea hideScrollbar={false}>
        <p>Content</p>
      </ScrollArea>,
    );
    el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain('hideScrollbar');
  });

  it('adds smoothScroll class by default', () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('smoothScroll');
  });

  it('omits smoothScroll class when disabled', () => {
    const { container } = render(
      <ScrollArea smoothScroll={false}>
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain('smoothScroll');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <p>Content</p>
      </ScrollArea>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional className', () => {
    const { container } = render(
      <ScrollArea className="my-custom-class">
        <p>Content</p>
      </ScrollArea>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-custom-class');
  });

  it('asChild renders as a different element', () => {
    render(
      <ScrollArea asChild>
        <section data-testid="scroll-section">
          <p>Content</p>
        </section>
      </ScrollArea>,
    );
    const section = screen.getByTestId('scroll-section');
    expect(section.tagName).toBe('SECTION');
    expect(section.className).toContain('scrollArea');
  });

  it('asChild returns null with no children', () => {
    const { container } = render(<ScrollArea asChild />);
    expect(container.firstChild).toBeNull();
  });
});
