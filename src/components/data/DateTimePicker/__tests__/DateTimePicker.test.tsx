import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DateTimePicker } from '../DateTimePicker';

describe('DateTimePicker', () => {
  it('renders the calendar', () => {
    render(<DateTimePicker />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders time steppers by default', () => {
    render(<DateTimePicker />);
    expect(screen.getByRole('group', { name: 'Hour' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Minute' })).toBeInTheDocument();
  });

  it('hides time steppers when showTime is false', () => {
    render(<DateTimePicker showTime={false} />);
    expect(screen.queryByRole('group', { name: 'Hour' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Minute' })).toBeNull();
  });

  it('shows seconds when showSeconds is true', () => {
    render(<DateTimePicker showSeconds />);
    expect(screen.getByRole('group', { name: 'Second' })).toBeInTheDocument();
  });

  it('calls onChange when hour is incremented', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 30)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment hour' }));
    expect(onChange).toHaveBeenCalledOnce();
    const result = onChange.mock.calls[0][0];
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(13);
  });

  it('calls onChange when minute is incremented', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 30)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment minute' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(31);
  });

  it('calls onChange when hour is decremented', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 30)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Decrement hour' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].getHours()).toBe(11);
  });

  it('calls onChange when minute is decremented', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 30)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Decrement minute' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(29);
  });

  it('applies className', () => {
    render(<DateTimePicker className="test-class" />);
    expect(screen.getByRole('grid').parentElement).toHaveClass('test-class');
  });

  it('works controlled', () => {
    const date = new Date(2024, 5, 15, 10, 30);
    render(<DateTimePicker value={date} />);
    const hourGroup = screen.getByRole('group', { name: 'Hour' });
    const minuteGroup = screen.getByRole('group', { name: 'Minute' });
    expect(hourGroup).toHaveTextContent('10');
    expect(minuteGroup).toHaveTextContent('30');
  });

  it('wraps hours at boundaries', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 23, 30)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment hour' }));
    expect(onChange.mock.calls[0][0].getHours()).toBe(0);
  });

  it('wraps minutes at boundaries', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 59)}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment minute' }));
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(0);
  });

  it('respects hourStep', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 0, 30)}
        hourStep={2}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment hour' }));
    expect(onChange.mock.calls[0][0].getHours()).toBe(2);
  });

  it('respects minuteStep', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateTimePicker
        onChange={onChange}
        defaultValue={new Date(2024, 5, 15, 12, 0)}
        minuteStep={5}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Increment minute' }));
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(5);
  });

  it('passes minDate and maxDate to Calendar', () => {
    render(
      <DateTimePicker
        defaultValue={new Date(2024, 5, 15)}
        minDate={new Date(2024, 5, 1)}
        maxDate={new Date(2024, 5, 10)}
      />,
    );
    const cells = screen.getAllByRole('gridcell');
    const day15 = cells.find((c) => c.textContent === '15');
    expect(day15!.querySelector('button')).toBeDisabled();
  });
});
