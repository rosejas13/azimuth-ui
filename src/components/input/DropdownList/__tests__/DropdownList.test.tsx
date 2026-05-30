import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownList } from '../DropdownList';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
  { value: 'sep1', label: '', separator: true },
  { value: 'd', label: 'Option D' },
];

describe('DropdownList', () => {
  it('renders with placeholder', () => {
    render(<DropdownList data={{ options, placeholder: 'Pick one' }} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });


  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('calls onChange on option click (single select)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} selection={{ onChange }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('closes dropdown after single select', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('stays open after multi select', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} selection={{ multiple: true, onChange: vi.fn() }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    await user.click(screen.getByText('Option A'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('displays selected value in trigger', () => {
    render(<DropdownList data={{ options }} selection={{ value: 'a' }} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('displays multiple selected values', () => {
    render(<DropdownList data={{ options }} selection={{ value: ['a', 'd'], multiple: true }} />);
    expect(screen.getByText('Option A, Option D')).toBeInTheDocument();
  });

  it('filters options when searchable', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options, search: { enabled: true } }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'A');
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.queryByText('Option B')).not.toBeInTheDocument();
  });

  it('shows no results message for unmatched search', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options, search: { enabled: true } }} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    await user.click(trigger);
    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'zzz');
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders separators', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects option with Enter key', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} selection={{ onChange }} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('applies custom className', () => {
    render(<DropdownList data={{ options }} className="my-dropdown" />);
    expect(document.querySelector('.my-dropdown')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<DropdownList data={{ options }} error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<DropdownList data={{ options }} disabled />);
    await user.click(document.querySelector('[aria-haspopup="listbox"]')!);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<DropdownList data={{ options }} />);
    const trigger = document.querySelector('[aria-haspopup="listbox"]')!;
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
