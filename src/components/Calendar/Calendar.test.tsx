import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders the calendar', () => {
    render(<Calendar />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders month navigation', () => {
    render(<Calendar />);
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
  });

  it('renders day headers', () => {
    render(<Calendar />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders day cells with role gridcell', () => {
    render(<Calendar />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('calls onChange when a day is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Calendar onChange={onChange} />);
    const cells = screen.getAllByRole('gridcell');
    const todayCell = cells.find(
      (c) => {
        const btn = c.querySelector('button');
        return btn && !btn.disabled && c.textContent;
      },
    );
    if (todayCell) {
      const btn = todayCell.querySelector('button')!;
      await user.click(btn);
      expect(onChange).toHaveBeenCalledOnce();
      const date = onChange.mock.calls[0][0];
      expect(date).toBeInstanceOf(Date);
    }
  });

  it('shows selected date when controlled', () => {
    const date = new Date(2024, 5, 15);
    render(<Calendar value={date} />);
    const selected = screen.getByText('15');
    expect(selected.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates months with prev/next buttons', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={new Date(2024, 5, 15)} />);
    const prevBtn = screen.getByRole('button', { name: 'Previous month' });
    await user.click(prevBtn);
    expect(screen.getByText('May 2024')).toBeInTheDocument();
    const nextBtn = screen.getByRole('button', { name: 'Next month' });
    await user.click(nextBtn);
    expect(screen.getByText('June 2024')).toBeInTheDocument();
  });

  it('disables dates outside min/max range', () => {
    render(
      <Calendar
        defaultValue={new Date(2024, 5, 15)}
        minDate={new Date(2024, 5, 10)}
        maxDate={new Date(2024, 5, 20)}
      />,
    );
    const cells = screen.getAllByRole('gridcell');
    const day1 = cells.find((c) => c.textContent === '1');
    expect(day1!.querySelector('button')).toBeDisabled();
    const day30 = cells.find((c) => c.textContent === '30');
    expect(day30!.querySelector('button')).toBeDisabled();
  });

  it('applies className', () => {
    render(<Calendar className="test-class" />);
    expect(screen.getByRole('grid')).toHaveClass('test-class');
  });

  it('does not call onChange for disabled dates', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15)}
        maxDate={new Date(2024, 5, 15)}
      />,
    );
    const cells = screen.getAllByRole('gridcell');
    const day20 = cells.find((c) => c.textContent === '16');
    if (day20) {
      const btn = day20.querySelector('button')!;
      await user.click(btn);
      expect(onChange).not.toHaveBeenCalled();
    }
  });
});
