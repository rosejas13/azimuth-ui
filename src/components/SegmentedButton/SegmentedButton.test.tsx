import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedButton } from './SegmentedButton';
import type { SegmentedButtonOption } from './SegmentedButton';

const options: SegmentedButtonOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('SegmentedButton', () => {
  it('renders all options', () => {
    render(<SegmentedButton options={options} />);
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
  });

  it('selects first option by default', () => {
    render(<SegmentedButton options={options} />);
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('respects defaultValue prop', () => {
    render(<SegmentedButton options={options} defaultValue="week" />);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('calls onChange on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SegmentedButton options={options} onChange={onChange} />);

    await user.click(screen.getByText('Week'));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('updates selection on click', async () => {
    const user = userEvent.setup();
    render(<SegmentedButton options={options} />);

    await user.click(screen.getByText('Month'));
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('respects controlled value prop', () => {
    const { rerender } = render(
      <SegmentedButton options={options} value="day" />,
    );
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    rerender(<SegmentedButton options={options} value="month" />);
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('controlled mode fires onChange but does not update internally', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SegmentedButton options={options} value="day" onChange={onChange} />,
    );

    await user.click(screen.getByText('Week'));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('has radiogroup role with correct child roles', () => {
    render(<SegmentedButton options={options} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('disables options when disabled is true', () => {
    const opts: SegmentedButtonOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ];
    render(<SegmentedButton options={opts} />);
    expect(screen.getByRole('radio', { name: 'B' })).toBeDisabled();
  });

  it('does not fire onChange for disabled option', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const opts: SegmentedButtonOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<SegmentedButton options={opts} onChange={onChange} />);

    await user.click(screen.getByText('B'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <SegmentedButton options={options} className="my-segmented" />,
    );
    const group = screen.getByRole('radiogroup');
    expect(group.className).toContain('my-segmented');
  });

  it('handles ArrowRight keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<SegmentedButton options={options} />);

    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('handles ArrowLeft keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<SegmentedButton options={options} defaultValue="month" />);

    screen.getByRole('radio', { name: 'Month' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('wraps around with ArrowRight at the end', async () => {
    const user = userEvent.setup();
    render(<SegmentedButton options={options} defaultValue="month" />);

    screen.getByRole('radio', { name: 'Month' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('renders with icons', () => {
    const opts: SegmentedButtonOption[] = [
      { value: 'grid', label: 'Grid', icon: <span data-testid="icon-grid">□</span> },
      { value: 'list', label: 'List', icon: <span data-testid="icon-list">≡</span> },
    ];
    render(<SegmentedButton options={opts} />);
    expect(screen.getByTestId('icon-grid')).toBeInTheDocument();
    expect(screen.getByTestId('icon-list')).toBeInTheDocument();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<SegmentedButton options={options} fullWidth />);
    const group = screen.getByRole('radiogroup');
    expect(group.className).toContain('fullWidth');
  });
});
