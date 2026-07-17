import { render, screen } from '@testing-library/react';
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
