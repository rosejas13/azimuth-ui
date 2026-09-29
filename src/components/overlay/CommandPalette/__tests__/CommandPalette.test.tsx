import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CommandPalette } from '../CommandPalette';

async function blurThenFocusOverlay(overlay: HTMLElement) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  overlay.focus();
  await waitFor(() => {
    expect(document.activeElement).toBe(overlay);
  });
}

const groups = [
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        shortcut: 'G D',
        icon: <span data-testid="icon-dash">🏠</span>,
      },
      { id: 'settings', label: 'Settings', shortcut: 'G S' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'new-file', label: 'New File', shortcut: 'Ctrl+N' },
      { id: 'search', label: 'Search Files', keywords: ['find', 'grep'] },
    ],
  },
];

describe('CommandPalette', () => {
  it('renders when open=true', () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    const { container } = render(
      <CommandPalette
        open={false}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows search input auto-focused', () => {
    vi.useFakeTimers();
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByLabelText('Search commands')).toHaveFocus();
    vi.useRealTimers();
  });

  it('shows grouped items', () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Search Files')).toBeInTheDocument();
  });

  it('filters items on search input', async () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.type(screen.getByLabelText('Search commands'), 'dash');
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.type(screen.getByLabelText('Search commands'), 'zzz123');
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('selects item on click', async () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByText('Dashboard'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dashboard' }),
    );
  });

  it('selects item with Enter', async () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={onSelect}
      />,
    );
    const input = screen.getByLabelText('Search commands');
    await userEvent.type(input, 'dashboard');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'dashboard' }),
    );
  });

  it('navigates with ArrowDown and ArrowUp', async () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByLabelText('Search commands'));
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on click outside overlay', async () => {
    const onClose = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on Space typed in the search input', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    const input = screen.getByLabelText('Search commands');
    await user.click(input);
    await user.keyboard('new file');
    expect(onClose).not.toHaveBeenCalled();
    expect(input).toHaveValue('new file');
  });

  it('does not close on Enter when no results match', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    const input = screen.getByLabelText('Search commands');
    await user.click(input);
    await user.type(input, 'zzz123');
    await user.keyboard('{Enter}');
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Space and Enter while the overlay itself is focused', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    const overlay = screen.getByRole('dialog');
    await blurThenFocusOverlay(overlay);
    await user.keyboard(' ');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('shows shortcuts when provided', () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('G D')).toBeInTheDocument();
    expect(screen.getByText('G S')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
  });

  it('shows icons when provided', () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByTestId('icon-dash')).toBeInTheDocument();
  });

  it('fires onClose when overlay clicked', async () => {
    const onClose = vi.fn();
    render(
      <CommandPalette
        open={true}
        onClose={onClose}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has proper aria attributes on input and items', () => {
    render(
      <CommandPalette
        open={true}
        onClose={vi.fn()}
        groups={groups}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Search commands')).toHaveAttribute(
      'aria-activedescendant',
      'cmd-item-dashboard',
    );
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('id', 'cmd-item-dashboard');
  });
});
