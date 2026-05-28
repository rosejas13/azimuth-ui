import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from '../Slider';

describe('Slider', () => {
  it('renders with slider role', () => {
    render(<Slider />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<Slider range={{ min: 10, max: 90 }} value={{ value: 50 }} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('uses defaultValue', () => {
    render(<Slider range={{ min: 0, max: 100 }} value={{ defaultValue: 42 }} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('renders value label when showValue is true', () => {
    render(<Slider value={{ value: 75 }} display={{ showValue: true }} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('calls onChange on keyboard interaction', () => {
    const onChange = vi.fn();
    render(<Slider value={{ value: 50, onChange }} range={{ step: 10 }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('ArrowLeft decreases value', () => {
    const onChange = vi.fn();
    render(<Slider value={{ value: 50, onChange }} range={{ step: 10 }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('Home sets value to min', () => {
    const onChange = vi.fn();
    render(<Slider range={{ min: 10, max: 100 }} value={{ value: 50, onChange }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('End sets value to max', () => {
    const onChange = vi.fn();
    render(<Slider range={{ min: 10, max: 100 }} value={{ value: 50, onChange }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('vertical orientation uses ArrowUp/Down', () => {
    const onChange = vi.fn();
    render(
      <Slider value={{ value: 50, onChange }} range={{ step: 10 }} display={{ orientation: 'vertical' }} />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(60);
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('clamps value between min and max', () => {
    render(<Slider range={{ min: 0, max: 100 }} value={{ value: 150 }} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies custom className', () => {
    render(<Slider className="my-slider" />);
    expect(document.querySelector('.my-slider')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<Slider value={{ disabled: true }} />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('has aria-orientation attribute', () => {
    render(<Slider display={{ orientation: 'vertical' }} />);
    expect(screen.getByRole('slider')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('renders size variants', () => {
    const { rerender } = render(<Slider display={{ size: 'sm' }} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
    rerender(<Slider display={{ size: 'lg' }} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});
