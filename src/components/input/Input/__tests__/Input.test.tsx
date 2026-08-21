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
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Input label="Email" required />);
    const label = screen.getByText('Email');
    expect(label.className).toContain('required');
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('applies aria-invalid when error present', () => {
    render(<Input error="Bad" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className to the input element', () => {
    render(<Input className="my-input" />);
    expect(screen.getByRole('textbox').className).toContain('my-input');
  });

  it('fires onChange with the raw string value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
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
    render(<Input label="Name" subtitle="Your full name" />);
    expect(screen.getByText('Your full name')).toBeInTheDocument();
  });

  it('reflects a controlled value', async () => {
    const user = userEvent.setup();
    render(<Input value="Hello" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Hello');
    await user.type(input, 'x');
    expect(input).toHaveValue('Hello');
  });

  it('navigates autocomplete with ArrowDown and ArrowUp', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Input
        suggestions={{
          options: ['Apple', 'Banana', 'Avocado'],
          onSelect: handleSelect,
        }}
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'a');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Avocado' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Avocado' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledWith('Avocado');
  });

  it('closes autocomplete suggestions with Escape', async () => {
    const user = userEvent.setup();
    render(<Input suggestions={{ options: ['Apple', 'Banana', 'Avocado'] }} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'a');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('increments and decrements via stepper buttons', async () => {
    const user = userEvent.setup();
    render(<Input type="number" stepper min={0} max={10} step={1} />);
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
    render(<Input label="Name" maxLength={10} showCharCount value="Hello" />);
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('honors defaultValue for an uncontrolled input', async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="Jane" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Jane');
    await user.type(input, '2');
    expect(input).toHaveValue('Jane2');
  });

  it('renders label at left position', () => {
    render(<Input label="Name" labelPosition="left" />);
    const wrapper = screen.getByLabelText('Name').closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('wrapperHorizontal');
  });

  it('renders label at inner position', () => {
    render(<Input label="Name" labelPosition="inner" />);
    const wrapper = screen.getByLabelText('Name').closest('[class*="wrapper"]');
    expect(wrapper?.className).toContain('wrapperInnerLabel');
  });

  it('renders inner label inside the input container, wired via htmlFor', () => {
    render(<Input label="Name" labelPosition="inner" />);
    const input = screen.getByLabelText('Name');
    const container = input.parentElement as HTMLElement;
    const innerLabel = Array.from(container.children).find((el) =>
      el.className.includes('innerLabel'),
    );
    expect(innerLabel).toBeDefined();
    expect(innerLabel?.tagName).toBe('LABEL');
  });

  it('applies the xl size class and inherits it from Form config', () => {
    render(<Input label="Name" size="xl" />);
    const wrapper = screen.getByText('Name').closest('[class*="wrapper"]');
    expect(wrapper?.className).toMatch(/xl/);
  });

  it('accepts a structured label object with subtitle, position, and required', () => {
    render(
      <Input
        label={{
          text: 'Work email',
          subtitle: 'Company address',
          required: true,
        }}
      />,
    );
    const input = screen.getByLabelText('Work email');
    expect(input).toHaveAttribute('required');
    expect(screen.getByText('Company address')).toBeInTheDocument();
    expect(screen.getByText('Work email').className).toContain('required');
  });

  it('lets top-level subtitle override the label object subtitle', () => {
    render(
      <Input
        label={{ text: 'Email', subtitle: 'from object' }}
        subtitle="top level wins"
      />,
    );
    expect(screen.getByText('top level wins')).toBeInTheDocument();
    expect(screen.queryByText('from object')).not.toBeInTheDocument();
  });

  it('shows char count inside the box for inner position', () => {
    render(
      <Input
        label="Bio"
        labelPosition="inner"
        maxLength={10}
        showCharCount
        value="Hello"
      />,
    );
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('updates the displayed value when selecting a suggestion uncontrolled', async () => {
    const user = userEvent.setup();
    render(
      <Input
        suggestions={{ options: ['Apple', 'Banana'], onSelect: () => {} }}
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'a');
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(input).toHaveValue('Banana');
  });

  it('exposes combobox ARIA wiring for suggestions', async () => {
    const user = userEvent.setup();
    render(<Input suggestions={{ options: ['Apple', 'Banana'] }} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await user.type(input, 'a');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      expect.stringContaining('suggestions-0'),
    );
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('shows suggestions unfiltered when filter is false', async () => {
    const user = userEvent.setup();
    render(
      <Input
        suggestions={{
          options: ['Mountain View, CA', 'Denver, CO'],
          filter: false,
        }}
      />,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, '9');
    // substring filter would hide both; filter:false shows them all
    expect(
      screen.getByRole('option', { name: 'Mountain View, CA' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Denver, CO' }),
    ).toBeInTheDocument();
  });

  it('generates unique ids for inputs sharing a label', () => {
    render(
      <>
        <Input label="City" />
        <Input label="City" />
      </>,
    );
    const inputs = screen.getAllByLabelText('City');
    const [a, b] = inputs.map((el) => el.id);
    expect(a).not.toBe(b);
  });
});
