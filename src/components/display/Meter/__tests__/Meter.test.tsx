import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Meter } from '../Meter';

function getFill(): HTMLElement {
  const el = screen.getByRole('meter').querySelector('[style]');
  expect(el).not.toBeNull();
  return el as HTMLElement;
}

describe('Meter', () => {
  it('renders meter role with correct aria-valuenow', () => {
    render(<Meter value={30} min={0} max={100} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '30');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps fill width between 0% and 100%', () => {
    const { rerender } = render(<Meter value={150} max={100} />);
    expect(getFill().style.width).toBe('100%');
    rerender(<Meter value={-10} min={0} max={100} />);
    expect(getFill().style.width).toBe('0%');
  });

  it('scales fill width within range', () => {
    render(<Meter value={3} min={0} max={10} />);
    expect(getFill().style.width).toBe('30%');
  });

  it('applies critical class when value is at or below low', () => {
    render(<Meter value={10} low={20} high={80} />);
    expect(screen.getByRole('meter')).toHaveClass('critical');
  });

  it('applies warn class when value is at or above high', () => {
    render(<Meter value={90} low={20} high={80} />);
    expect(screen.getByRole('meter')).toHaveClass('warn');
  });

  it('applies ok class within thresholds', () => {
    render(<Meter value={50} low={20} high={80} />);
    expect(screen.getByRole('meter')).toHaveClass('ok');
  });

  it('renders value as "value/max" when showValue is true', () => {
    render(<Meter value={3} max={10} showValue />);
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it('does not render value by default', () => {
    render(<Meter value={3} max={10} />);
    expect(screen.queryByText('3/10')).toBeNull();
  });

  it('uses label as aria-label', () => {
    render(<Meter value={40} label="Disk usage" />);
    expect(
      screen.getByRole('meter', { name: 'Disk usage' }),
    ).toBeInTheDocument();
  });

  it('generates an aria-label when none is provided', () => {
    render(<Meter value={40} />);
    expect(screen.getByRole('meter').getAttribute('aria-label')).toMatch(
      /^meter/,
    );
  });

  it('prefers caller aria-label over the generated one', () => {
    render(<Meter value={40} aria-label="Custom gauge" />);
    expect(
      screen.getByRole('meter', { name: 'Custom gauge' }),
    ).toBeInTheDocument();
  });
});
