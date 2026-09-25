import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';

vi.mock('@/theme/useThemeMode', () => ({
  useThemeMode: vi.fn(() => ({
    mode: 'light',
    toggle: vi.fn(),
  })),
}));

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has an aria-label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });

  it('applies size class', () => {
    const { container } = render(<ThemeToggle size="lg" />);
    expect(container.firstChild).toHaveClass('lg');
  });
});

describe('ThemeToggle controlled mode', () => {
  it('reports the next cycle mode via onModeChange when mode is controlled', async () => {
    const onModeChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <ThemeToggle mode="light" onModeChange={onModeChange} />,
    );
    await user.click(screen.getByRole('button'));
    expect(onModeChange).toHaveBeenCalledWith('dark');
    rerender(<ThemeToggle mode="dark" onModeChange={onModeChange} />);
    await user.click(screen.getByRole('button'));
    expect(onModeChange).toHaveBeenLastCalledWith('system');
  });

  it('controlled mode never writes localStorage', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => undefined);
    try {
      render(<ThemeToggle mode="system" onModeChange={() => {}} />);
    } finally {
      spy.mockRestore();
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it('icon and aria-label reflect the controlled mode', () => {
    render(<ThemeToggle mode="dark" onModeChange={() => {}} />);
    expect(
      screen.getByRole('button', { name: 'Switch to system theme' }),
    ).toBeInTheDocument();
  });
});
