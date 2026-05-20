import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Menu } from './Menu';
import type { MenuItem } from './Menu';

const sampleItems: MenuItem[] = [
  { key: 'edit', label: 'Edit' },
  { key: 'copy', label: 'Copy' },
  { key: 'sep1', label: '', separator: true },
  { key: 'delete', label: 'Delete', danger: true },
  { key: 'archive', label: 'Archive', disabled: true },
];

function getMenuItemButton(label: string): HTMLElement | null {
  return screen.getByText(label).closest('button');
}

describe('Menu', () => {
  it('renders trigger button', () => {
    render(<Menu items={sampleItems} />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('renders custom trigger', () => {
    render(<Menu items={sampleItems} trigger={<span>Options</span>} />);
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders menu items when open', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders disabled items', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('calls onSelect with item key on click', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Menu items={sampleItems} onSelect={onSelect} />);
    await user.click(screen.getByLabelText('Open menu'));
    await user.click(screen.getByText('Edit'));
    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('closes menu after selection', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    await user.click(screen.getByText('Edit'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not select disabled items', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Menu items={sampleItems} onSelect={onSelect} />);
    await user.click(screen.getByLabelText('Open menu'));
    await user.click(screen.getByText('Archive'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('does not select separator', async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        items={[{ key: 'sep', label: '', separator: true }]}
        onSelect={onSelect}
      />,
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Menu items={sampleItems} />
        <button type="button">Outside</button>
      </div>,
    );
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByText('Outside'));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('navigates items with keyboard', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));

    await waitFor(() => {
      expect(getMenuItemButton('Edit')).toHaveFocus();
    });

    fireEvent.keyDown(getMenuItemButton('Edit')!, { key: 'ArrowDown' });

    expect(getMenuItemButton('Copy')).toHaveFocus();
  });

  it('navigates up with ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));

    await waitFor(() => {
      expect(getMenuItemButton('Edit')).toHaveFocus();
    });

    fireEvent.keyDown(getMenuItemButton('Edit')!, { key: 'ArrowUp' });

    expect(getMenuItemButton('Archive')).toHaveFocus();
  });

  it('selects item with Enter key', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Menu items={sampleItems} onSelect={onSelect} />);
    await user.click(screen.getByLabelText('Open menu'));

    await waitFor(() => {
      expect(getMenuItemButton('Edit')).toHaveFocus();
    });

    fireEvent.keyDown(getMenuItemButton('Edit')!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('renders danger items with danger class', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    const deleteBtn = getMenuItemButton('Delete');
    expect(deleteBtn).toHaveClass('itemDanger');
  });

  it('renders disabled items with aria-disabled', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    const archiveBtn = getMenuItemButton('Archive');
    expect(archiveBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies role menuitem to items', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    const menuitems = screen.getAllByRole('menuitem');
    expect(menuitems.length).toBe(4);
  });

  it('applies role menu to panel', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Menu items={sampleItems} className="custom-menu" />);
    expect(document.querySelector('.custom-menu')).toBeInTheDocument();
  });

  it('toggles menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    const trigger = screen.getByLabelText('Open menu');
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('has aria-haspopup and aria-expanded on trigger', () => {
    render(<Menu items={sampleItems} />);
    const trigger = screen.getByLabelText('Open menu');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded to true when open', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    const trigger = screen.getByLabelText('Open menu');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders icon in menu item', async () => {
    const user = userEvent.setup();
    const items: MenuItem[] = [
      { key: 'edit', label: 'Edit', icon: <span data-testid="edit-icon">✎</span> },
    ];
    render(<Menu items={items} />);
    await user.click(screen.getByLabelText('Open menu'));
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('applies right side position', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} side="right" />);
    await user.click(screen.getByLabelText('Open menu'));
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('panelRight');
  });

  it('displays correct displayName', () => {
    expect(Menu.displayName).toBe('Menu');
  });

  it('opens on Enter key press on trigger', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    const trigger = screen.getByLabelText('Open menu');
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens on ArrowDown key press on trigger', async () => {
    const user = userEvent.setup();
    render(<Menu items={sampleItems} />);
    const trigger = screen.getByLabelText('Open menu');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
