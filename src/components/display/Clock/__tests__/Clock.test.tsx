import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Clock } from '../Clock';

describe('Clock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders clock mode with time display', () => {
    vi.setSystemTime(new Date('2025-01-01T12:34:00'));
    render(<Clock mode="clock" />);
    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-label', '12:34');
  });

  it('updates clock every second', () => {
    vi.setSystemTime(new Date('2025-01-01T12:00:00'));
    render(<Clock mode="clock" />);
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', '12:00');
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', '12:01');
  });

  it('renders countdown mode with time remaining', () => {
    vi.setSystemTime(new Date('2025-01-01T12:00:00'));
    const target = new Date('2025-01-01T13:05:10');
    render(<Clock mode="countdown" targetDate={target} />);
    expect(screen.getByText('hrs')).toBeInTheDocument();
    expect(screen.getByText('min')).toBeInTheDocument();
    expect(screen.getByText('sec')).toBeInTheDocument();
  });

  it('shows times up when countdown target is reached', () => {
    vi.setSystemTime(new Date('2025-01-01T12:00:00'));
    const past = new Date('2025-01-01T11:00:00');
    render(<Clock mode="countdown" targetDate={past} />);
    expect(screen.getByText(/Time.s up!/)).toBeInTheDocument();
  });

  it('renders stopwatch mode at zero', () => {
    render(<Clock mode="stopwatch" autoStart={false} />);
    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-label', 'Stopwatch: 00:00:00.00');
  });

  it('renders size sm variant', () => {
    render(<Clock size="sm" />);
    expect(screen.getByRole('timer')).toHaveClass('sm');
  });

  it('renders size md variant', () => {
    render(<Clock size="md" />);
    expect(screen.getByRole('timer')).toHaveClass('md');
  });

  it('renders size lg variant', () => {
    render(<Clock size="lg" />);
    expect(screen.getByRole('timer')).toHaveClass('lg');
  });

  it('renders 24h format', () => {
    vi.setSystemTime(new Date('2025-01-01T14:30:00'));
    render(<Clock mode="clock" format="24h" />);
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', '14:30');
  });

  it('renders 12h format', () => {
    vi.setSystemTime(new Date('2025-01-01T14:30:00'));
    render(<Clock mode="clock" format="12h" />);
    expect(screen.getByRole('timer')).toHaveAttribute('aria-label', '02:30 PM');
  });

  it('applies custom className', () => {
    render(<Clock className="my-clock" />);
    expect(screen.getByRole('timer')).toHaveClass('my-clock');
  });
});
