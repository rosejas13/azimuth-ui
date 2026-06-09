import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { KPICard } from '../KPICard';

describe('KPICard', () => {
  const baseProps = { value: '$12.4K', label: 'Revenue' };

  it('renders value and label', () => {
    render(<KPICard {...baseProps} />);
    expect(screen.getByText('$12.4K')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<KPICard {...baseProps} icon={<span data-testid="icon">$</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders trend indicator for all directions', () => {
    const { rerender } = render(<KPICard {...baseProps} trend="up" />);
    expect(screen.getByLabelText('Trend: up')).toBeInTheDocument();

    rerender(<KPICard {...baseProps} trend="down" />);
    expect(screen.getByLabelText('Trend: down')).toBeInTheDocument();

    rerender(<KPICard {...baseProps} trend="neutral" />);
    expect(screen.getByLabelText('Trend: neutral')).toBeInTheDocument();
  });

  it('renders trend value text', () => {
    render(<KPICard {...baseProps} trend="up" trendValue="+12.5%" />);
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<KPICard {...baseProps} description="Monthly recurring revenue" />);
    expect(screen.getByText('Monthly recurring revenue')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<KPICard {...baseProps} variant="accent" />);
    expect(container.firstChild).toHaveClass('accent');
  });

  it('does not render trend section when no trend props provided', () => {
    render(<KPICard {...baseProps} />);
    expect(screen.queryByLabelText(/Trend:/)).not.toBeInTheDocument();
    expect(screen.queryByText('+12.5%')).not.toBeInTheDocument();
  });

  it('handles onClick and has button role', async () => {
    const handleClick = vi.fn();
    render(<KPICard {...baseProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    await userEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard Enter key', async () => {
    const handleClick = vi.fn();
    render(<KPICard {...baseProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard Space key', async () => {
    const handleClick = vi.fn();
    render(<KPICard {...baseProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    card.focus();
    await userEvent.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <KPICard {...baseProps} className="my-card" />,
    );
    expect(container.firstChild).toHaveClass('my-card');
  });

  it('renders all variants without error', () => {
    const variants = [
      'default',
      'accent',
      'success',
      'warning',
      'danger',
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<KPICard {...baseProps} variant={variant} />);
      expect(screen.getByText('$12.4K')).toBeInTheDocument();
      unmount();
    }
  });

  it('does not have button role when onClick is not provided', () => {
    render(<KPICard {...baseProps} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
