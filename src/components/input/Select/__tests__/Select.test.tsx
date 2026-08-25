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
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders placeholder option', () => {
    render(<Select placeholder="Choose..." options={options} />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('fires onChange with the selected value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '2');
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('shows error message', () => {
    render(<Select error="Required field" options={options} />);
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

  it('honors defaultValue for an uncontrolled select', () => {
    render(<Select options={options} defaultValue="2" />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('respects controlled value prop', () => {
    render(<Select options={options} value="2" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('calls onChange when controlled value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} value="1" onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '2');
    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('1');
  });
});

describe('Select (multiple)', () => {
  it('fires onChange with the full array of selected values', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} multiple onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('listbox'), ['1', '2']);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenLastCalledWith(['1', '2']);
  });

  it('reflects a controlled array value', () => {
    const { rerender } = render(
      <Select options={options} multiple value={['1']} onChange={() => {}} />,
    );
    const selectedOf = () =>
      screen
        .getAllByRole('option', { selected: true })
        .map((opt) => opt.getAttribute('value'));
    expect(selectedOf()).toEqual(['1']);
    rerender(
      <Select
        options={options}
        multiple
        value={['1', '2']}
        onChange={() => {}}
      />,
    );
    expect(selectedOf()).toEqual(['1', '2']);
  });

  it('renders a listbox role when multiple', () => {
    render(<Select options={options} multiple />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});

describe('Select (cleared state)', () => {
  it('accepts null as a controlled value and shows no selection', () => {
    render(<Select options={options} value={null} onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('');
    expect(select.querySelector('option[value=""][hidden]')).not.toBeNull();
  });

  it('clears when rerendered from a value to null', () => {
    const { rerender } = render(
      <Select options={options} value="2" onChange={() => {}} />,
    );
    expect(screen.getByRole('combobox').value).toBe('2');
    rerender(<Select options={options} value={null} onChange={() => {}} />);
    expect(screen.getByRole('combobox').value).toBe('');
  });

  it('starts blank for uncontrolled with null defaultValue', () => {
    render(<Select options={options} defaultValue={null} />);
    expect(screen.getByRole('combobox').value).toBe('');
  });

  it('still fires onChange normally after a cleared render', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Select options={options} value={null} onChange={handleChange} />,
    );
    rerender(<Select options={options} value="" onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '1');
    expect(handleChange).toHaveBeenCalledWith('1');
  });
});
