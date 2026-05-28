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
});
