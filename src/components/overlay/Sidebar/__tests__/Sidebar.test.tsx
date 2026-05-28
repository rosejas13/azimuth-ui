import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../Sidebar';

const iconDashboard = <span data-testid="icon-dashboard">📊</span>;
const iconSettings = <span data-testid="icon-settings">⚙️</span>;
const iconAdmin = <span data-testid="icon-admin">🔧</span>;

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: iconDashboard, badge: 3 },
  { key: 'settings', label: 'Settings', icon: iconSettings },
  {
    key: 'admin',
    label: 'Admin',
    icon: iconAdmin,
    children: [
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
    ],
  },
];

describe('Sidebar', () => {
  it('renders header slot', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
        header={<span>My Header</span>}
      />,
    );
    expect(screen.getByText('My Header')).toBeInTheDocument();
  });

  it('renders items with labels', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders icons on items', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    expect(screen.getByTestId('icon-admin')).toBeInTheDocument();
  });

  it('renders badge counts', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights active item', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const activeBtn = screen.getByText('Dashboard').closest('button');
    expect(activeBtn).toHaveClass('itemActive');
  });

  it('calls onSelect on click', async () => {
    const onSelect = vi.fn();
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={onSelect}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByText('Settings'));
    expect(onSelect).toHaveBeenCalledWith('settings');
  });

  it('renders footer slot', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
        footer={<span>Footer Text</span>}
      />,
    );
    expect(screen.getByText('Footer Text')).toBeInTheDocument();
  });

  it('renders collapsed state', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={true}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('collapsed');
  });

  it('renders expanded state', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('expanded');
  });

  it('renders nested items when section expanded', async () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Admin'));
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
  });

  it('toggles nested section on click', async () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const adminBtn = screen.getByText('Admin').closest('button')!;
    await userEvent.click(adminBtn);
    expect(screen.getByText('Users')).toBeInTheDocument();
    await userEvent.click(adminBtn);
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });

  it('renders toggle button', () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument();
  });

  it('Enter key triggers onSelect', async () => {
    const onSelect = vi.fn();
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={onSelect}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const user = userEvent.setup();
    screen.getByText('Dashboard').closest('button')!.focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('dashboard');
  });

  it('Space key triggers onSelect', async () => {
    const onSelect = vi.fn();
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={onSelect}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const user = userEvent.setup();
    screen.getByText('Dashboard').closest('button')!.focus();
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledWith('dashboard');
  });

  it('ArrowDown navigates to next item', async () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const user = userEvent.setup();
    screen.getByText('Dashboard').closest('button')!.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Settings').closest('button')).toHaveFocus();
  });

  it('ArrowUp navigates to previous item with wraparound', async () => {
    render(
      <Sidebar
        items={items}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const user = userEvent.setup();
    screen.getByText('Dashboard').closest('button')!.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Admin').closest('button')).toHaveFocus();
  });

  it('handles empty items', () => {
    render(
      <Sidebar
        items={[]}
        activeKey="dashboard"
        onSelect={vi.fn()}
        collapsed={false}
        onToggle={vi.fn()}
      />,
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });
});
