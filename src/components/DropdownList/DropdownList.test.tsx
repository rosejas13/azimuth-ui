import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownList } from './DropdownList';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
  { value: 'sep1', label: '', separator: true },
  { value: 'd', label: 'Option D' },
];

describe('DropdownList', () => {
  it('renders with placeholder', () => {
    render(<DropdownList options={options} placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });


  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('calls onChange on option click (single select)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DropdownList options={options} onChange={onChange} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('closes dropdown after single select', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('stays open after multi select', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} multiple onChange={vi.fn()} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('displays selected value in trigger', () => {
    render(<DropdownList options={options} value="a" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('displays multiple selected values', () => {
    render(<DropdownList options={options} value={['a', 'd']} multiple />);
    expect(screen.getByText('Option A, Option D')).toBeInTheDocument();
  });

  it('filters options when searchable', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} searchable />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'Option A');
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.queryByText('Option B')).not.toBeInTheDocument();
  });

  it('shows empty message when no results', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} searchable />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'zzz');
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders separators', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects option with Enter key', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DropdownList options={options} onChange={onChange} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('applies custom className', () => {
    render(<DropdownList options={options} className="my-dropdown" />);
    expect(document.querySelector('.my-dropdown')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<DropdownList options={options} error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<DropdownList options={options} disabled />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<DropdownList options={options} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
