import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

const presets = ['#DC2626', '#2563EB', '#16A34A', '#CA8A04', '#9333EA'];

describe('ColorPicker', () => {
  it('renders preset swatches', () => {
    render(<ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />);

    presets.forEach((color) => {
      expect(screen.getByLabelText(color)).toBeInTheDocument();
    });
  });

  it('shows correct number of swatches', () => {
    render(<ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />);

    const swatches = screen.getAllByRole('radio');
    expect(swatches).toHaveLength(presets.length);
  });

  it('marks selected swatch as checked', () => {
    render(<ColorPicker value="#2563EB" onChange={vi.fn()} presets={presets} />);

    expect(screen.getByLabelText('#DC2626')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByLabelText('#2563EB')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText('#16A34A')).toHaveAttribute('aria-checked', 'false');
  });

  it('marks selected swatch as checked with case-insensitive match', () => {
    render(<ColorPicker value="#dc2626" onChange={vi.fn()} presets={presets} />);

    expect(screen.getByLabelText('#DC2626')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange on swatch click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ColorPicker value="#DC2626" onChange={onChange} presets={presets} />);

    await user.click(screen.getByLabelText('#2563EB'));

    expect(onChange).toHaveBeenCalledWith('#2563EB');
  });

  it('renders custom input when showInput is true', () => {
    render(
      <ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} showInput />,
    );

    expect(screen.getByLabelText('Custom color value')).toBeInTheDocument();
  });

  it('does not render custom input when showInput is false', () => {
    render(
      <ColorPicker
        value="#DC2626"
        onChange={vi.fn()}
        presets={presets}
        showInput={false}
      />,
    );

    expect(
      screen.queryByLabelText('Custom color value'),
    ).not.toBeInTheDocument();
  });

  it('accepts valid CSS color in input and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker value="#DC2626" onChange={onChange} presets={presets} showInput />,
    );

    const input = screen.getByLabelText('Custom color value');
    await user.clear(input);
    await user.type(input, '#CA8A04');

    expect(onChange).toHaveBeenCalledWith('#CA8A04');
  });

  it('accepts valid CSS named color in input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker value="#DC2626" onChange={onChange} presets={presets} showInput />,
    );

    const input = screen.getByLabelText('Custom color value');
    await user.clear(input);
    await user.type(input, 'red');

    expect(onChange).toHaveBeenCalledWith('red');
  });

  it('does not call onChange for invalid CSS color', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker value="#DC2626" onChange={onChange} presets={presets} showInput />,
    );

    const input = screen.getByLabelText('Custom color value');
    await user.clear(input);
    await user.type(input, 'not-a-color');

    expect(onChange).not.toHaveBeenCalledWith('not-a-color');
  });

  it('resets input to value on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker value="#DC2626" onChange={onChange} presets={presets} showInput />,
    );

    const input = screen.getByLabelText('Custom color value');
    await user.clear(input);
    await user.type(input, 'bl');

    await user.tab();

    expect(input).toHaveValue('#DC2626');
  });

  it('has radiogroup role on swatches', () => {
    render(<ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('renders radiogroup with aria-label', () => {
    render(<ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />);

    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-label',
      'Color presets',
    );
  });

  it('renders sm size variant', () => {
    const { container } = render(
      <ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} size="sm" />,
    );

    expect(container.firstChild).toHaveClass('sm');
  });

  it('renders md size by default', () => {
    const { container } = render(
      <ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />,
    );

    expect(container.firstChild).toHaveClass('md');
  });

  it('renders checkmark on selected swatch', () => {
    render(<ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} />);

    const selectedSwatch = screen.getByLabelText('#DC2626');
    expect(selectedSwatch.textContent).toContain('✓');
  });

  it('applies preview background color style', () => {
    render(
      <ColorPicker value="#DC2626" onChange={vi.fn()} presets={presets} showInput />,
    );

    const preview = document.querySelector('[style*="background-color"]');
    expect(preview).not.toBeNull();
  });
});
