import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('renders with icon', () => {
    render(
      <IconButton icon={<span data-testid="icon" />} aria-label="Close" />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('sets aria-label', () => {
    render(<IconButton icon={<span />} aria-label="Delete" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('applies variant', () => {
    render(<IconButton icon={<span />} aria-label="Edit" variant="primary" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('primary');
  });

  it('forwards click handler', () => {
    let clicked = false;
    render(
      <IconButton
        icon={<span />}
        aria-label="Test"
        onClick={() => {
          clicked = true;
        }}
      />,
    );
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });

  it('can be disabled', () => {
    render(<IconButton icon={<span />} aria-label="Disabled" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Enter key triggers click', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<span />} aria-label="Test" onClick={onClick} />);
    const user = userEvent.setup();
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Space key triggers click', async () => {
    const onClick = vi.fn();
    render(<IconButton icon={<span />} aria-label="Test" onClick={onClick} />);
    const user = userEvent.setup();
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('variant CSS class assertions', () => {
    const { unmount: unmountPrimary } = render(
      <IconButton icon={<span />} aria-label="Primary" variant="primary" />,
    );
    expect(screen.getByRole('button').className).toContain('primary');
    unmountPrimary();

    const { unmount: unmountSecondary } = render(
      <IconButton icon={<span />} aria-label="Secondary" variant="secondary" />,
    );
    expect(screen.getByRole('button').className).toContain('secondary');
    unmountSecondary();

    render(
      <IconButton icon={<span />} aria-label="Tertiary" variant="tertiary" />,
    );
    expect(screen.getByRole('button').className).toContain('tertiary');
  });

  it('size CSS class assertions', () => {
    const { unmount: unmountSm } = render(
      <IconButton icon={<span />} aria-label="Small" size="sm" />,
    );
    expect(screen.getByRole('button').className).toContain('sm');
    unmountSm();

    const { unmount: unmountMd } = render(
      <IconButton icon={<span />} aria-label="Medium" size="md" />,
    );
    expect(screen.getByRole('button').className).toContain('md');
    unmountMd();

    render(<IconButton icon={<span />} aria-label="Large" size="lg" />);
    expect(screen.getByRole('button').className).toContain('lg');
  });
});
