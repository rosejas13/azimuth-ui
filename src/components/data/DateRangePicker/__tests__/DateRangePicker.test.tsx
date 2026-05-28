import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DateRangePicker } from '../DateRangePicker';

describe('DateRangePicker', () => {
  it('renders two date input fields', () => {
    render(<DateRangePicker />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
  });

  it('renders label when provided', () => {
    render(<DateRangePicker label="Trip dates" />);
    expect(screen.getByText('Trip dates')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<DateRangePicker placeholder="Pick a date" />);
    const inputs = screen.getAllByPlaceholderText('Pick a date');
    expect(inputs).toHaveLength(2);
  });

  it('displays formatted start and end values', () => {
    render(
      <DateRangePicker
        value={{ start: new Date(2024, 5, 15), end: new Date(2024, 5, 20) }}
      />,
    );
    expect(screen.getByDisplayValue('Jun 15, 2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jun 20, 2024')).toBeInTheDocument();
  });

  it('opens calendar popup on input focus', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('calls onChange when selecting dates', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DateRangePicker onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    const cells = screen.getAllByRole('gridcell');
    const dayBtn = cells.find((c) => {
      const btn = c.querySelector('button');
      return btn && !btn.disabled && c.textContent === '15';
    });
    if (dayBtn) {
      const btn = dayBtn.querySelector('button')!;
      await user.click(btn);
      expect(onChange).toHaveBeenCalled();
      const range = onChange.mock.calls[0][0];
      expect(range).toHaveProperty('start');
      expect(range).toHaveProperty('end');
    }
  });

  it('shows time steppers when includeTime is true', () => {
    render(
      <DateRangePicker includeTime value={{ start: new Date(2024, 5, 15, 10, 30), end: null }} />,
    );
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders stacked layout when includeTime is true', () => {
    render(<DateRangePicker includeTime />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<DateRangePicker className="test-class" />);
    expect(container.firstElementChild).toHaveClass('test-class');
  });

  it('closes popup on outside click', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});
