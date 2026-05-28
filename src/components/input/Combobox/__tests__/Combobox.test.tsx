import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from '../Combobox';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('renders input with label', () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
        label="Fruit"
      />,
    );
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows dropdown on type', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('filters options by input text', async () => {
    render(
      <Combobox
        selection={{ value: "app", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Cherry' })).not.toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onSelect).toHaveBeenCalledWith('cherry');
  });

  it('selects option with Enter key', async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('apple');
  });

  it('navigates with ArrowDown and ArrowUp', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    const opts = screen.getAllByRole('option');
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(opts[0]).toHaveAttribute('aria-selected', 'false');
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}');
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
    expect(opts[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('closes on Escape', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on click outside', async () => {
    render(
      <div>
        <Combobox
          selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
          data={{ options }}
        />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows empty message when no results', async () => {
    render(
      <Combobox
        selection={{ value: "zzz", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
        error="Invalid selection"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid selection');
  });

  it('handles disabled state', () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
        disabled
      />,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('has role=combobox on input', () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has role=listbox on dropdown', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('has role=option on items', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    const opts = screen.getAllByRole('option');
    expect(opts.length).toBe(3);
  });

  it('has aria-selected on selected item', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('has aria-controls linking input to list', async () => {
    render(
      <Combobox
        selection={{ value: "", onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    const input = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
  });
});
