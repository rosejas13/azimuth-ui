import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QuantityStepper } from '../QuantityStepper';

describe('QuantityStepper', () => {
  it('renders with default value', () => {
    render(<QuantityStepper />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments value on + click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements value on - click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper defaultValue={3} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables decrease button at min', () => {
    render(<QuantityStepper defaultValue={1} min={1} />);
    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled();
  });

  it('disables increase button at max', () => {
    render(<QuantityStepper defaultValue={5} max={5} />);
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
  });

  it('respects custom step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper defaultValue={1} step={3} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables both buttons when disabled', () => {
    render(<QuantityStepper disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('works in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <QuantityStepper value={3} onChange={onChange} />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(4);
    rerender(<QuantityStepper value={4} onChange={onChange} />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('updates displayed value on increment', async () => {
    const user = userEvent.setup();
    render(<QuantityStepper defaultValue={1} />);
    await user.click(screen.getByRole('button', { name: /increase/i }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<QuantityStepper className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders label when provided', () => {
    render(<QuantityStepper label="Quantity" />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });
});
