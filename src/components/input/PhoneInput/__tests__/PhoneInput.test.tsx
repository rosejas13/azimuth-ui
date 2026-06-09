import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PhoneInput } from '../PhoneInput';

describe('PhoneInput', () => {
  it('renders without crashing with default props', () => {
    const { container } = render(<PhoneInput />);
    const input = container.querySelector('input[type="tel"]');
    expect(input).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<PhoneInput label="Phone" />);
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
  });

  it('displays the country code button', () => {
    render(<PhoneInput />);
    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
  });

  it('shows default country code +1', () => {
    render(<PhoneInput />);
    const btn = screen.getByLabelText('Country code');
    expect(btn).toHaveTextContent('+1');
  });

  it('shows different default country code when defaultCountry is GB', () => {
    render(<PhoneInput defaultCountry="GB" />);
    const btn = screen.getByLabelText('Country code');
    expect(btn).toHaveTextContent('+44');
  });

  it('opens dropdown on country button click', async () => {
    const user = userEvent.setup();
    render(<PhoneInput />);
    await user.click(screen.getByLabelText('Country code'));
    expect(screen.getByLabelText('Search countries')).toBeInTheDocument();
  });

  it('changes country code on selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneInput onChange={handleChange} />);

    await user.click(screen.getByLabelText('Country code'));
    await user.click(screen.getByText('United Kingdom'));

    expect(handleChange).toHaveBeenCalledWith({
      code: '+44',
      number: '',
    });
  });

  it('types phone number', async () => {
    const user = userEvent.setup();
    render(<PhoneInput />);
    const input = screen.getByPlaceholderText('Phone number');
    await user.type(input, '5551234567');
    expect(input).toHaveValue('5551234567');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneInput onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Phone number');
    await user.type(input, '555');

    expect(handleChange).toHaveBeenCalledWith({
      code: '+1',
      number: '555',
    });
  });

  it('displays error message', () => {
    render(<PhoneInput error="Invalid phone number" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid phone number');
  });

  it('displays helpText when no error', () => {
    render(<PhoneInput helpText="Enter your phone number" />);
    expect(screen.getByText('Enter your phone number')).toBeInTheDocument();
  });

  it('does not show helpText when error is present', () => {
    render(<PhoneInput error="Invalid" helpText="Enter your phone number" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid');
    expect(
      screen.queryByText('Enter your phone number'),
    ).not.toBeInTheDocument();
  });

  it('supports controlled value', () => {
    const { rerender } = render(
      <PhoneInput value={{ code: '+44', number: '7700123456' }} />,
    );
    expect(screen.getByPlaceholderText('Phone number')).toHaveValue(
      '7700123456',
    );

    rerender(<PhoneInput value={{ code: '+49', number: '17612345678' }} />);
    expect(screen.getByPlaceholderText('Phone number')).toHaveValue(
      '17612345678',
    );
  });

  it('forwards ref to the tel input element', () => {
    const ref = vi.fn();
    render(<PhoneInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('uses defaultValue for uncontrolled initial state', () => {
    render(
      <PhoneInput defaultValue={{ code: '+49', number: '17612345678' }} />,
    );
    expect(screen.getByPlaceholderText('Phone number')).toHaveValue(
      '17612345678',
    );
  });
});
