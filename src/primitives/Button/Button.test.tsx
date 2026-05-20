import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="my-class">Click</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('my-class');
  });

  it('renders with icon on left', () => {
    render(<Button icon={<span data-testid="icon">X</span>}>Save</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders icon as button when no children', () => {
    render(<Button icon={<span data-testid="icon">X</span>} aria-label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders all variants without error', () => {
    const variants = ['primary', 'secondary', 'tertiary', 'link', 'danger'] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <Button variant={variant}>{variant}</Button>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount();
    }
  });

  it('renders all sizes without error', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      unmount();
    }
  });

  it('passes through additional HTML attributes', () => {
    render(
      <Button type="submit" data-testid="btn">
        Submit
      </Button>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('type', 'submit');
  });
});
