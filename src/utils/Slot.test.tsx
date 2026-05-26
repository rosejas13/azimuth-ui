import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Slot } from './Slot';

describe('Slot', () => {
  it('renders child element', () => {
    render(
      <Slot>
        <a href="/test">Link</a>
      </Slot>,
    );
    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
  });

  it('merges className from Slot and child', () => {
    render(
      <Slot className="slot-class">
        <a href="/test" className="link-class">Link</a>
      </Slot>,
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('slot-class');
    expect(link.className).toContain('link-class');
  });

  it('passes through additional props to child', () => {
    render(
      <Slot data-testid="slot" aria-label="test-label">
        <a href="/test">Link</a>
      </Slot>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-testid', 'slot');
    expect(link).toHaveAttribute('aria-label', 'test-label');
  });

  it('chains both Slot and child onClick handlers', async () => {
    const user = userEvent.setup();
    const slotClick = vi.fn();
    const childClick = vi.fn();
    render(
      <Slot onClick={slotClick}>
        <button onClick={childClick}>Click</button>
      </Slot>,
    );
    await user.click(screen.getByRole('button'));
    expect(childClick).toHaveBeenCalledOnce();
    expect(slotClick).toHaveBeenCalledOnce();
  });

  it('returns null when no children provided', () => {
    const { container } = render(<Slot />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when children is not a valid element', () => {
    const { container } = render(<Slot>{'string child'}</Slot>);
    expect(container.innerHTML).toBe('');
  });

  it('forwards ref to child element', () => {
    const ref = vi.fn();
    render(
      <Slot ref={ref}>
        <a href="/test">Link</a>
      </Slot>,
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLAnchorElement);
  });
});
