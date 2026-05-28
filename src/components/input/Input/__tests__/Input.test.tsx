import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Input label={{ text: "Email" }} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Input label={{ text: "Email", required: true }} />);
    const label = screen.getByText('Email');
    expect(label.className).toContain('required');
  });

  it('shows error message', () => {
    render(<Input label={{ text: "Email", error: "Invalid email" }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('applies aria-invalid when error present', () => {
    render(<Input label={{ error: "Bad" }} />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('is disabled', () => {
    render(<Input value={{ disabled: true }} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="my-input" />);
    expect(screen.getByRole('textbox').className).toContain('my-input');
  });

  it('fires onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input value={{ onChange: handleChange }} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders number type', () => {
    render(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders email type', () => {
    render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders subtitle', () => {
    render(<Input label={{ text: "Name", subtitle: "Your full name" }} />);
    expect(screen.getByText('Your full name')).toBeInTheDocument();
  });

  it('navigates autocomplete with ArrowDown and ArrowUp', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Input
        autocomplete={{ options: ['Apple', 'Banana', 'Avocado'], onSelect: handleSelect }}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Avocado' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Avocado' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledWith('Avocado');
  });

  it('increments and decrements via stepper buttons', async () => {
    const user = userEvent.setup();
    render(<Input type="number" stepper={{ enabled: true, min: 0, max: 10, step: 1 }} />);
    const input = screen.getByRole('spinbutton');
    const incrementBtn = screen.getByLabelText('Increment');
    const decrementBtn = screen.getByLabelText('Decrement');

    await user.click(incrementBtn);
    expect(input).toHaveValue(1);

    await user.click(incrementBtn);
    expect(input).toHaveValue(2);

    await user.click(decrementBtn);
    expect(input).toHaveValue(1);
  });

  it('displays character count when maxLength is set and showCharCount is true', () => {
    render(<Input label={{ text: 'Name' }} charCount={{ maxLength: 10, showCharCount: true }} value={{ value: 'Hello' }} />);
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('renders label at left position', () => {
    render(<Input label={{ text: 'Name', position: 'left' }} />);
    const wrapper = screen.getByLabelText('Name').closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('wrapperHorizontal');
  });

  it('renders label at inner position', () => {
    render(<Input label={{ text: 'Name', position: 'inner' }} />);
    const wrapper = screen.getByLabelText('Name').closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('wrapperInnerLabel');
  });
});
