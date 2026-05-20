import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders children text', () => {
    render(<Chip>TypeScript</Chip>);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Chip variant={variant}>{variant}</Chip>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders with delete button', () => {
    render(<Chip deletable>React</Chip>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('delete button has correct aria-label', () => {
    render(<Chip deletable>React</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove React');
  });

  it('fires onDelete', async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();
    render(<Chip deletable onDelete={handleDelete}>React</Chip>);
    await user.click(screen.getByRole('button'));
    expect(handleDelete).toHaveBeenCalledOnce();
  });

  it('does not show delete button when not deletable', () => {
    render(<Chip>React</Chip>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('applies role button when onClick provided', () => {
    render(<Chip onClick={() => {}}>Click me</Chip>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Chip onClick={handleClick}>Click me</Chip>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('fires onClick on keyboard enter', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Chip onClick={handleClick}>Click me</Chip>);
    screen.getByRole('button').focus();
    await user.keyboard('{enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected class', () => {
    render(<Chip selected>Selected</Chip>);
    expect(document.querySelector('.selected')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<Chip avatar={<span>👤</span>}>User</Chip>);
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Chip className="my-chip">Test</Chip>);
    expect(document.querySelector('.my-chip')).toBeInTheDocument();
  });

  it('renders size sm', () => {
    render(<Chip size="sm">Small</Chip>);
    expect(document.querySelector('.sm')).toBeInTheDocument();
  });

  it('does not apply role button when no onClick', () => {
    render(<Chip>Plain</Chip>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('delete click does not trigger onClick', async () => {
    const handleClick = vi.fn();
    const handleDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <Chip onClick={handleClick} deletable onDelete={handleDelete}>
        Both
      </Chip>,
    );
    await user.click(screen.getByRole('button', { name: 'Remove Both' }));
    expect(handleDelete).toHaveBeenCalledOnce();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
