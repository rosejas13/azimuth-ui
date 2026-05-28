import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    render(<SearchBar placeholder="Find items..." />);
    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
  });

  it('has search role', () => {
    render(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('has searchbox role on input', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('calls onSearch when Enter is pressed', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} debounceMs={0} />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'hello');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('hello');
  });

  it('shows clear button when value is present', async () => {
    const user = userEvent.setup();
    render(<SearchBar clearable />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('clears value on clear button click', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} debounceMs={0} />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    await user.click(screen.getByLabelText('Clear search'));
    expect(input).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('does not show clear button when clearable is false', async () => {
    const user = userEvent.setup();
    render(<SearchBar clearable={false} />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'hi');
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('shows suggestions based on input', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        suggestions={['apple', 'banana', 'apricot']}
        debounceMs={0}
      />,
    );
    const input = screen.getByRole('searchbox');
    await user.type(input, 'ap');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('apricot')).toBeInTheDocument();
  });

  it('calls onSuggestionSelect on click', async () => {
    const onSuggestionSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar
        suggestions={['apple', 'banana']}
        onSuggestionSelect={onSuggestionSelect}
        debounceMs={0}
      />,
    );
    const input = screen.getByRole('searchbox');
    await user.type(input, 'ap');
    await user.click(screen.getByText('apple'));
    expect(onSuggestionSelect).toHaveBeenCalledWith('apple');
  });

  it('closes suggestions on Escape', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar suggestions={['apple', 'banana']} debounceMs={0} />,
    );
    const input = screen.getByRole('searchbox');
    await user.type(input, 'ap');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('selects suggestion with Enter key', async () => {
    const onSuggestionSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar
        suggestions={['apple', 'banana']}
        onSuggestionSelect={onSuggestionSelect}
        debounceMs={0}
      />,
    );
    const input = screen.getByRole('searchbox');
    await user.type(input, 'ap');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSuggestionSelect).toHaveBeenCalledWith('apple');
  });

  it('applies custom className', () => {
    render(<SearchBar className="my-search" />);
    expect(screen.getByRole('search')).toHaveClass('my-search');
  });

  it('debounces onSearch calls', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} debounceMs={50} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    await new Promise((r) => setTimeout(r, 100));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('abc');
  });
});
