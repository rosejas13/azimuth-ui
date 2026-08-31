import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from '../DatePicker';

describe('DatePicker', () => {
  it('renders the input', () => {
    render(<DatePicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
  });

  it('uses default placeholder when none provided', () => {
    render(<DatePicker />);
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('opens calendar popup on click', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a date and closes the popup', async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    const input = screen.getByRole('textbox');
    await user.click(input);

    const cells = screen.getAllByRole('gridcell');
    const dayBtn = cells.find((c) => {
      const btn = c.querySelector('button');
      return btn && !btn.disabled && c.textContent === '15';
    });
    if (dayBtn) {
      const btn = dayBtn.querySelector('button')!;
      await user.click(btn);
    }

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('calls onChange when a date is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DatePicker onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.click(input);

    const cells = screen.getAllByRole('gridcell');
    const dayBtn = cells.find((c) => {
      const btn = c.querySelector('button');
      return btn && !btn.disabled;
    });
    if (dayBtn) {
      const btn = dayBtn.querySelector('button')!;
      await user.click(btn);
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    }
  });

  it('displays formatted date when value is provided', () => {
    render(<DatePicker value={new Date(2026, 0, 15)} />);
    expect(screen.getByDisplayValue('January 15, 2026')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<DatePicker error="Invalid date" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
  });

  it('renders help text', () => {
    render(<DatePicker helpText="Choose a date" />);
    expect(screen.getByText('Choose a date')).toBeInTheDocument();
  });

  it('does not render help text when error is present', () => {
    render(<DatePicker error="Error" helpText="Help" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('disables the input', () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not open popup when disabled', async () => {
    const user = userEvent.setup();
    render(<DatePicker disabled />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('forwards ref to the wrapper div', () => {
    const ref = { current: null };
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders label when provided', () => {
    render(<DatePicker label="Date" />);
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<DatePicker className="test-class" />);
    const wrapper = screen.getByRole('textbox').parentElement?.parentElement;
    expect(wrapper).toHaveClass('test-class');
  });

  it('applies width to the wrapper', () => {
    render(<DatePicker width="240px" />);
    const wrapper = screen.getByRole('textbox').parentElement?.parentElement;
    expect(wrapper).toHaveStyle({ width: '240px' });
  });
});

describe('DatePicker format tokens', () => {
  const date = new Date(2026, 7, 25); // Aug 25 2026 — single-digit month/day

  it('formats custom MM-dd-yy', () => {
    render(<DatePicker value={date} format="MM-dd-yy" />);
    expect(screen.getByDisplayValue('08-25-26')).toBeInTheDocument();
  });

  it('formats custom MM dd yyyy', () => {
    render(<DatePicker value={date} format="MM dd yyyy" />);
    expect(screen.getByDisplayValue('08 25 2026')).toBeInTheDocument();
  });

  it('formats ISO yyyy-MM-dd via tokens', () => {
    render(<DatePicker value={date} format="yyyy-MM-dd" />);
    expect(screen.getByDisplayValue('2026-08-25')).toBeInTheDocument();
  });

  it('keeps legacy presets working', () => {
    render(<DatePicker value={new Date(2026, 0, 15)} format="P" />);
    expect(screen.getByDisplayValue('01/15/2026')).toBeInTheDocument();
  });

  it('falls back to PPP for unknown formats', () => {
    render(<DatePicker value={new Date(2026, 0, 15)} format="nonsense" />);
    expect(screen.getByDisplayValue('January 15, 2026')).toBeInTheDocument();
  });
});
