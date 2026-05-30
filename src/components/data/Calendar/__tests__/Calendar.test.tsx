import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from '../Calendar';

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

  it('navigates to next day with ArrowRight', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 15)} />,
    );
    screen.getByText('15').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 5, 16));
  });

  it('navigates to previous day with ArrowLeft', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 15)} />,
    );
    screen.getByText('15').focus();
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 5, 14));
  });

  it('navigates forward a week with ArrowDown', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 15)} />,
    );
    screen.getByText('15').focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 5, 22));
  });

  it('navigates back a week with ArrowUp', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 15)} />,
    );
    screen.getByText('15').focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 5, 8));
  });

  it('navigates across month boundary with ArrowRight from end of month', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 30)} />,
    );
    const cells = screen.getAllByText('30');
    const selectedDay = cells.find(
      (c) => c.closest('[role="gridcell"]')?.getAttribute('aria-selected') === 'true',
    );
    selectedDay?.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 6, 1));
  });

  it('navigates across month boundary with ArrowLeft from start of month', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 1)} />,
    );
    const cells = screen.getAllByText('1');
    const selectedDay = cells.find(
      (c) => c.closest('[role="gridcell"]')?.getAttribute('aria-selected') === 'true',
    );
    selectedDay?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 4, 31));
  });

  it('navigates across week boundary with ArrowUp from first week', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 5, 3)} />,
    );
    const cells = screen.getAllByText('3');
    const selectedDay = cells.find(
      (c) => c.closest('[role="gridcell"]')?.getAttribute('aria-selected') === 'true',
    );
    selectedDay?.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 4, 27));
  });

  it('navigates across year boundary with ArrowRight from Dec 31', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar onChange={onChange} defaultValue={new Date(2024, 11, 31)} />,
    );
    const cells = screen.getAllByText('31');
    const selectedDay = cells.find(
      (c) => c.closest('[role="gridcell"]')?.getAttribute('aria-selected') === 'true',
    );
    selectedDay?.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(new Date(2025, 0, 1));
  });

  it('does not navigate to disabled dates with arrow keys', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar
        onChange={onChange}
        defaultValue={new Date(2024, 5, 10)}
        minDate={new Date(2024, 5, 10)}
        maxDate={new Date(2024, 5, 20)}
      />,
    );
    screen.getByText('10').focus();
    await user.keyboard('{ArrowLeft}');
    expect(onChange).not.toHaveBeenCalled();

    screen.getByText('20').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
