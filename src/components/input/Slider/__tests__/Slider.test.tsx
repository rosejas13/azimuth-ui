import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from '../Slider';
import { InputConfigProvider } from '../../input-config';

describe('Slider', () => {
  it('renders with slider role', () => {
    render(<Slider />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<Slider range={{ min: 10, max: 90 }} value={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('uses defaultValue', () => {
    render(<Slider range={{ min: 0, max: 100 }} defaultValue={42} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('renders value label when showValue is true', () => {
    render(<Slider value={75} display={{ showValue: true }} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('calls onChange on keyboard interaction', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} range={{ step: 10 }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('ArrowLeft decreases value', () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} range={{ step: 10 }} />);
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('Home sets value to min', () => {
    const onChange = vi.fn();
    render(
      <Slider range={{ min: 10, max: 100 }} value={50} onChange={onChange} />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('End sets value to max', () => {
    const onChange = vi.fn();
    render(
      <Slider range={{ min: 10, max: 100 }} value={50} onChange={onChange} />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('vertical orientation uses ArrowUp/Down', () => {
    const onChange = vi.fn();
    render(
      <Slider
        value={50}
        onChange={onChange}
        range={{ step: 10 }}
        display={{ orientation: 'vertical' }}
      />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(60);
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('clamps value between min and max', () => {
    render(<Slider range={{ min: 0, max: 100 }} value={150} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies custom className', () => {
    render(<Slider className="my-slider" />);
    expect(document.querySelector('.my-slider')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<Slider disabled />);
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

describe('Slider size inheritance (InputConfigContext)', () => {
  it('inherits size from InputConfigContext', () => {
    const { container } = render(
      <InputConfigProvider value={{ size: 'sm' }}>
        <Slider />
      </InputConfigProvider>,
    );
    expect(container.querySelector('[class*="track"]')).toHaveClass('trackSm');
  });

  it('instance size wins over context', () => {
    const { container } = render(
      <InputConfigProvider value={{ size: 'sm' }}>
        <Slider display={{ size: 'lg' }} />
      </InputConfigProvider>,
    );
    expect(container.querySelector('[class*="track"]')).toHaveClass('trackLg');
  });

  it('clamps an inherited xl down to lg (no xl styles)', () => {
    const { container } = render(
      <InputConfigProvider value={{ size: 'xl' }}>
        <Slider />
      </InputConfigProvider>,
    );
    expect(container.querySelector('[class*="track"]')).toHaveClass('trackLg');
  });

  it('defaults to md without context', () => {
    const { container } = render(<Slider />);
    const track = container.querySelector('[class*="track"]')!;
    expect(track).not.toHaveClass('trackSm');
    expect(track).not.toHaveClass('trackLg');
  });
});

describe('Slider flush (InputConfigContext)', () => {
  it('flushes the wrapper inside a group', () => {
    const { container } = render(
      <InputConfigProvider value={{ flushed: true }}>
        <Slider />
      </InputConfigProvider>,
    );
    expect(container.firstChild).toHaveClass('flushed');
  });

  it('stays unflushed by default', () => {
    const { container } = render(<Slider />);
    expect(container.firstChild).not.toHaveClass('flushed');
  });
});
