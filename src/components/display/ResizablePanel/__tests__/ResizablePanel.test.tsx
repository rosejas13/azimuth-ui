import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ResizablePanel } from '../ResizablePanel';

function mockGetBoundingClientRect(el: HTMLElement, width = 1000, height = 500) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
    x: 0,
    y: 0,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    toJSON: () => ({}),
  });
}

describe('ResizablePanel', () => {
  it('renders children', () => {
    render(
      <ResizablePanel>
        <div>Left</div>
        <div>Right</div>
      </ResizablePanel>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('renders a single child', () => {
    render(
      <ResizablePanel>
        <div>Only</div>
      </ResizablePanel>,
    );
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  it('renders dividers between panels', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </ResizablePanel>,
    );
    const panels = container.querySelectorAll('[class*="panel"]');
    expect(panels).toHaveLength(3);
    const dividers = container.querySelectorAll('[class*="divider"]');
    expect(dividers).toHaveLength(2);
  });

  it('applies horizontal direction by default', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('horizontal');
  });

  it('applies vertical direction class', () => {
    const { container } = render(
      <ResizablePanel direction="vertical">
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('vertical');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ResizablePanel className="my-panel">
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('my-panel');
  });

  it('starts drag on divider mousedown', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const divider = container.querySelector('[class*="divider"]') as HTMLElement;
    fireEvent.mouseDown(divider, { clientX: 200, clientY: 0 });
    const overlay = document.body.querySelector('[class*="dragOverlay"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.mouseUp(document);
  });

  it('removes overlay on mouseup after drag', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const divider = container.querySelector('[class*="divider"]') as HTMLElement;
    fireEvent.mouseDown(divider, { clientX: 200, clientY: 0 });
    fireEvent.mouseUp(document);
    const overlay = document.body.querySelector('[class*="dragOverlay"]');
    expect(overlay).not.toBeInTheDocument();
  });

  it('uses defaultSizes when provided', () => {
    const { container } = render(
      <ResizablePanel defaultSizes={[30, 70]}>
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const panels = container.querySelectorAll('[class*="panel"]');
    expect((panels[0] as HTMLElement).style.width).toBe('30%');
    expect((panels[1] as HTMLElement).style.width).toBe('70%');
  });

  it('uses equal sizes when no defaultSizes', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </ResizablePanel>,
    );
    const panels = container.querySelectorAll('[class*="panel"]');
    expect((panels[0] as HTMLElement).style.width).toBe('33.333333333333336%');
    expect((panels[1] as HTMLElement).style.width).toBe('33.333333333333336%');
  });

  it('handles vertical direction with defaultSizes', () => {
    const { container } = render(
      <ResizablePanel direction="vertical" defaultSizes={[40, 60]}>
        <div>Top</div>
        <div>Bottom</div>
      </ResizablePanel>,
    );
    const panels = container.querySelectorAll('[class*="panel"]');
    expect((panels[0] as HTMLElement).style.height).toBe('40%');
    expect((panels[1] as HTMLElement).style.height).toBe('60%');
  });

  it('passes through HTML attributes', () => {
    render(
      <ResizablePanel id="test-panel" data-testid="rp">
        <div>A</div>
      </ResizablePanel>,
    );
    expect(screen.getByTestId('rp')).toHaveAttribute('id', 'test-panel');
  });

  it('applies active class on divider during drag', () => {
    const { container } = render(
      <ResizablePanel>
        <div>A</div>
        <div>B</div>
      </ResizablePanel>,
    );
    const divider = container.querySelector('[class*="divider"]') as HTMLElement;
    expect(divider.className).not.toContain('dividerActive');
    fireEvent.mouseDown(divider, { clientX: 200, clientY: 0 });
    const dividerAfter = container.querySelector(
      '[class*="divider"]',
    ) as HTMLElement;
    expect(dividerAfter.className).toContain('dividerActive');
    fireEvent.mouseUp(document);
  });

  it('resizes panels with ArrowRight in horizontal mode', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResizablePanel>
        <div>Left</div>
        <div>Right</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    mockGetBoundingClientRect(root);

    const separator = screen.getByRole('separator');
    separator.focus();

    expect(separator).toHaveAttribute('aria-valuenow', '50');

    await user.keyboard('{ArrowRight}');

    expect(separator).toHaveAttribute('aria-valuenow', '55');
  });

  it('resizes panels with ArrowLeft in horizontal mode', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResizablePanel>
        <div>Left</div>
        <div>Right</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    mockGetBoundingClientRect(root);

    const separator = screen.getByRole('separator');
    separator.focus();

    expect(separator).toHaveAttribute('aria-valuenow', '50');

    await user.keyboard('{ArrowLeft}');

    expect(separator).toHaveAttribute('aria-valuenow', '45');
  });

  it('resizes panels with ArrowDown in vertical mode', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResizablePanel direction="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    mockGetBoundingClientRect(root);

    const separator = screen.getByRole('separator');
    separator.focus();

    expect(separator).toHaveAttribute('aria-valuenow', '50');

    await user.keyboard('{ArrowDown}');

    expect(separator).toHaveAttribute('aria-valuenow', '55');
  });

  it('resizes panels with ArrowUp in vertical mode', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResizablePanel direction="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </ResizablePanel>,
    );
    const root = container.firstChild as HTMLElement;
    mockGetBoundingClientRect(root);

    const separator = screen.getByRole('separator');
    separator.focus();

    expect(separator).toHaveAttribute('aria-valuenow', '50');

    await user.keyboard('{ArrowUp}');

    expect(separator).toHaveAttribute('aria-valuenow', '45');
  });
});
