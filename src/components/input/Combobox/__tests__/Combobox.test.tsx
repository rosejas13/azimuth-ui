import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from '../Combobox';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function rect(overrides: Partial<DOMRect>): DOMRect {
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    toJSON: () => ({}),
    ...overrides,
  };
}

describe('Combobox', () => {
  it('renders input with label', () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
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
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('filters options by input text', async () => {
    render(
      <Combobox
        selection={{ value: 'app', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Banana' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Cherry' }),
    ).not.toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect }}
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
        selection={{ value: '', onChange: vi.fn(), onSelect }}
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
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
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
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
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
          selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
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
        selection={{ value: 'zzz', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
        error="Invalid selection"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid selection');
  });

  it('handles disabled state', () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
        disabled
      />,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('has role=combobox on input', () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has role=listbox on dropdown', async () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('has role=option on items', async () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
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
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('has aria-controls linking input to list', async () => {
    render(
      <Combobox
        selection={{ value: '', onChange: vi.fn(), onSelect: vi.fn() }}
        data={{ options }}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'a');
    const input = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
  });

  it('does not crash when typing text with no matches', async () => {
    function Wrapper() {
      const [val, setVal] = useState('');
      return (
        <Combobox
          selection={{ value: val, onChange: setVal, onSelect: vi.fn() }}
          data={{ options }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows empty message when typing non-matching text', async () => {
    function Wrapper() {
      const [val, setVal] = useState('');
      return (
        <Combobox
          selection={{ value: val, onChange: setVal, onSelect: vi.fn() }}
          data={{ options }}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.type(screen.getByRole('combobox'), 'xyz');
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('accepts custom filter function', async () => {
    const customFilter = vi.fn((opt: { label: string }, q: string) =>
      opt.label.toLowerCase().startsWith(q.toLowerCase()),
    );
    function Wrapper() {
      const [val, setVal] = useState('');
      return (
        <Combobox
          selection={{ value: val, onChange: setVal, onSelect: vi.fn() }}
          data={{ options }}
          filter={customFilter}
        />
      );
    }
    render(<Wrapper />);
    await userEvent.type(screen.getByRole('combobox'), 'ch');
    // Starts with "ch" — Cherry matches, Apple/Banana do not
    expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Apple' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Banana' }),
    ).not.toBeInTheDocument();
    expect(customFilter).toHaveBeenCalled();
  });
});

describe('Combobox listbox positioning', () => {
  function StatefulCombobox() {
    const [val, setVal] = useState('');
    return (
      <Combobox
        selection={{ value: val, onChange: setVal, onSelect: vi.fn() }}
        data={{ options }}
      />
    );
  }

  async function openWithType() {
    render(<StatefulCombobox />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'a');
    return { input, listbox: screen.getByRole('listbox') };
  }

  it('keeps the listbox below the input when there is room', async () => {
    const { input, listbox } = await openWithType();
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      rect({ bottom: 100, top: 60, left: 8, width: 200 }),
    );
    vi.spyOn(listbox, 'getBoundingClientRect').mockReturnValue(
      rect({ height: 100 }),
    );
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(listbox).toHaveStyle({ top: '104px' });
  });

  it('flips the listbox above the input when space below is insufficient', async () => {
    const { input, listbox } = await openWithType();
    // Input near the bottom of a 768px jsdom viewport; listbox is 100px tall.
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      rect({ bottom: 700, top: 660, left: 8, width: 200 }),
    );
    vi.spyOn(listbox, 'getBoundingClientRect').mockReturnValue(
      rect({ height: 100 }),
    );
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    // 660 - 100 - 4 = 556 — above the input, inside the viewport.
    expect(listbox).toHaveStyle({ top: '556px' });
  });

  it('re-anchors the flipped listbox when filtering changes its height', async () => {
    const { input, listbox } = await openWithType();
    let listboxHeight = 200;
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      rect({ bottom: 700, top: 660, left: 8, width: 200 }),
    );
    vi.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() =>
      rect({ height: listboxHeight }),
    );
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    // Flipped above: 660 - 200 - 4 = 456.
    expect(listbox).toHaveStyle({ top: '456px' });

    // Filtering shrinks the listbox to 40px — now it fits in the 68px below.
    listboxHeight = 40;
    await userEvent.type(input, 'p');
    // Re-measured and reset below the input: 700 + 4.
    expect(listbox).toHaveStyle({ top: '704px' });
  });

  it('clamps a very tall flipped listbox inside the viewport', async () => {
    const { input, listbox } = await openWithType();
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      rect({ bottom: 700, top: 660, left: 8, width: 200 }),
    );
    vi.spyOn(listbox, 'getBoundingClientRect').mockReturnValue(
      rect({ height: 800 }),
    );
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    // 660 - 800 - 4 is negative; clamped to the viewport top margin.
    expect(listbox).toHaveStyle({ top: '4px' });
  });
});
