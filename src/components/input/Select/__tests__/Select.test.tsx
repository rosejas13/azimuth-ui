import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '../Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders select with options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders with label', () => {
    render(<Select label={{ text: 'Country' }} options={options} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders placeholder option', () => {
    render(<Select placeholder="Choose..." options={options} />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('fires onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '2');
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('shows error message', () => {
    render(<Select label={{ error: 'Required field' }} options={options} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('can be disabled', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Select options={options} className="my-select" />);
    expect(screen.getByRole('combobox').className).toContain('my-select');
  });
});
