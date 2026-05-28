import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from '../Toggle';

describe('Toggle', () => {
  it('renders toggle', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with label via prop', () => {
    render(<Toggle label="Notifications" />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('renders with label via children', () => {
    render(<Toggle>Notifications</Toggle>);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle onChange={handleChange} />);
    await user.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<Toggle disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('can be checked by default', () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Toggle size={size} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
      unmount();
    }
  });

  it('toggles with Space key', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle onChange={handleChange} />);
    const toggle = screen.getByRole('switch');
    toggle.focus();
    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('does not toggle with Enter key (only Space toggles checkboxes)', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Toggle onChange={handleChange} />);
    const toggle = screen.getByRole('switch');
    toggle.focus();
    await user.keyboard('{Enter}');
    expect(handleChange).not.toHaveBeenCalled();
    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('respects controlled checked prop', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Toggle checked={false} onChange={handleChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    rerender(<Toggle checked onChange={handleChange} />);
    expect(toggle).toBeChecked();
  });

  it('sets aria-checked correctly', () => {
    const { rerender } = render(<Toggle defaultChecked key="1" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    rerender(<Toggle key="2" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });
});
