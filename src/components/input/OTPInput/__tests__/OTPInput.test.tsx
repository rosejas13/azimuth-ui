import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { OTPInput } from '../OTPInput';

describe('OTPInput', () => {
  it('renders correct number of inputs based on default length', () => {
    render(<OTPInput value="" />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders correct number of inputs based on custom length', () => {
    render(<OTPInput value="" length={6} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('auto-advances focus on digit entry', async () => {
    const user = userEvent.setup();
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], '5');

    expect(inputs[1]).toHaveFocus();
  });

  it('calls onChange with concatenated value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function TestWrapper() {
      const [value, setValue] = useState('');
      return (
        <OTPInput
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      );
    }

    render(<TestWrapper />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');
    await user.type(inputs[2], '3');
    await user.type(inputs[3], '4');

    expect(onChange).toHaveBeenLastCalledWith('1234');
  });

  it('strips non-numeric input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OTPInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'a');

    const calls = onChange.mock.calls;
    const lastCall = calls[calls.length - 1][0];
    expect(lastCall).not.toContain('a');
  });

  it('handles paste across all inputs', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OTPInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('1234');

    expect(onChange).toHaveBeenCalledWith('1234');
  });

  it('strips non-digits from pasted content', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OTPInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('a1b2');

    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('handles backspace on an empty input to go to previous and clear it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OTPInput value="12" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveValue('2');

    await user.click(inputs[1]);
    onChange.mockClear();

    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('handles backspace on a filled input to clear it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<OTPInput value="12" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');

    await user.click(inputs[0]);
    onChange.mockClear();

    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('handles ArrowLeft to move focus to previous input', async () => {
    const user = userEvent.setup();
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[2]);
    await user.keyboard('{ArrowLeft}');

    expect(inputs[1]).toHaveFocus();
  });

  it('handles ArrowRight to move focus to next input', async () => {
    const user = userEvent.setup();
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[1]);
    await user.keyboard('{ArrowRight}');

    expect(inputs[2]).toHaveFocus();
  });

  it('does not move focus left from the first input', async () => {
    const user = userEvent.setup();
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.keyboard('{ArrowLeft}');

    expect(inputs[0]).toHaveFocus();
  });

  it('does not move focus right from the last input', async () => {
    const user = userEvent.setup();
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[3]);
    await user.keyboard('{ArrowRight}');

    expect(inputs[3]).toHaveFocus();
  });

  it('handles disabled state', () => {
    render(<OTPInput value="" disabled />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('applies error class when error is true', () => {
    const { container } = render(<OTPInput value="" error />);

    expect(container.firstChild).toHaveClass('error');
  });

  it('does not apply error class when error is false', () => {
    const { container } = render(<OTPInput value="" />);

    expect(container.firstChild).not.toHaveClass('error');
  });

  it('renders sm size variant', () => {
    const { container } = render(<OTPInput value="" size="sm" />);

    expect(container.firstChild).toHaveClass('sm');
  });

  it('renders md size variant by default', () => {
    const { container } = render(<OTPInput value="" />);

    expect(container.firstChild).toHaveClass('md');
  });

  it('renders lg size variant', () => {
    const { container } = render(<OTPInput value="" size="lg" />);

    expect(container.firstChild).toHaveClass('lg');
  });

  it('inputs have inputMode="numeric"', () => {
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('inputmode', 'numeric');
    });
  });

  it('inputs have maxLength={1}', () => {
    render(<OTPInput value="" />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('maxlength', '1');
    });
  });

  it('has role="group"', () => {
    render(<OTPInput value="" />);

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('has aria-label on container', () => {
    render(<OTPInput value="" />);

    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'One-time code input',
    );
  });

  it('renders filled values correctly', () => {
    render(<OTPInput value="987" length={4} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('9');
    expect(inputs[1]).toHaveValue('8');
    expect(inputs[2]).toHaveValue('7');
    expect(inputs[3]).toHaveValue('');
  });

  it('truncates value longer than length', () => {
    render(<OTPInput value="12345" length={4} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveValue('3');
    expect(inputs[3]).toHaveValue('4');
  });
});
