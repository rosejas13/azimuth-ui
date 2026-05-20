import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DateTimePicker } from './DateTimePicker';

describe('DateTimePicker', () => {
  it('renders the calendar', () => {
    render(<DateTimePicker />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders time selects by default', () => {
    render(<DateTimePicker />);
    expect(screen.getByLabelText('Hour')).toBeInTheDocument();
    expect(screen.getByLabelText('Minute')).toBeInTheDocument();
  });

  it('hides time selects when showTime is false', () => {
    render(<DateTimePicker showTime={false} />);
    expect(screen.queryByLabelText('Hour')).toBeNull();
    expect(screen.queryByLabelText('Minute')).toBeNull();
  });

  it('shows seconds when showSeconds is true', () => {
    render(<DateTimePicker showSeconds />);
    expect(screen.getByLabelText('Second')).toBeInTheDocument();
  });

  it('calls onChange when hour is changed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DateTimePicker onChange={onChange} defaultValue={new Date(2024, 5, 15, 12, 30)} />);
    await user.selectOptions(screen.getByLabelText('Hour'), '15');
    expect(onChange).toHaveBeenCalledOnce();
    const result = onChange.mock.calls[0][0];
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(15);
  });

  it('calls onChange when minute is changed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DateTimePicker onChange={onChange} defaultValue={new Date(2024, 5, 15, 12, 30)} />);
    await user.selectOptions(screen.getByLabelText('Minute'), '45');
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(45);
  });

  it('applies className', () => {
    render(<DateTimePicker className="test-class" />);
    expect(screen.getByRole('grid').parentElement).toHaveClass('test-class');
  });

  it('works controlled', () => {
    const date = new Date(2024, 5, 15, 10, 30);
    render(<DateTimePicker value={date} />);
    const hourSelect = screen.getByLabelText('Hour') as HTMLSelectElement;
    const minuteSelect = screen.getByLabelText('Minute') as HTMLSelectElement;
    expect(hourSelect.value).toBe('10');
    expect(minuteSelect.value).toBe('30');
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
