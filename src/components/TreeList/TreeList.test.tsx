import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TreeList } from './TreeList';
import type { TreeNode } from './TreeList';

const simpleData: TreeNode[] = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
];

const nestedData: TreeNode[] = [
  {
    id: '1',
    label: 'Folder 1',
    children: [
      { id: '1-1', label: 'File 1-1' },
      { id: '1-2', label: 'File 1-2' },
    ],
  },
  { id: '2', label: 'File 2' },
];

const deepData: TreeNode[] = [
  {
    id: '1',
    label: 'Root',
    children: [
      {
        id: '1-1',
        label: 'Child',
        children: [{ id: '1-1-1', label: 'Grandchild' }],
      },
    ],
  },
];

describe('TreeList', () => {
  it('renders all top-level nodes', () => {
    render(<TreeList data={simpleData} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('has role="tree" on root', () => {
    render(<TreeList data={simpleData} />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('each node has role="treeitem"', () => {
    render(<TreeList data={simpleData} />);
    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(3);
  });

  it('shows arrows for nodes with children', () => {
    render(<TreeList data={nestedData} />);
    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
  });

  it('does not show children when collapsed', () => {
    render(<TreeList data={nestedData} />);
    expect(screen.queryByText('File 1-1')).not.toBeInTheDocument();
  });

  it('shows children after clicking expand arrow', async () => {
    const user = userEvent.setup();
    render(<TreeList data={nestedData} />);
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(screen.getByText('File 1-1')).toBeInTheDocument();
    expect(screen.getByText('File 1-2')).toBeInTheDocument();
  });

  it('calls onSelect when clicking a node', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<TreeList data={simpleData} onSelect={onSelect} />);
    await user.click(screen.getByText('Item 1'));
    expect(onSelect).toHaveBeenCalledWith(simpleData[0]);
  });

  it('does not call onSelect for disabled nodes', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const data: TreeNode[] = [
      { id: '1', label: 'Disabled', disabled: true },
    ];
    render(<TreeList data={data} onSelect={onSelect} />);
    await user.click(screen.getByText('Disabled'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onToggle when expanding/collapsing', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TreeList data={nestedData} onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(onToggle).toHaveBeenCalledWith(nestedData[0], true);
  });

  it('applies selected state with selectedId prop', () => {
    render(<TreeList data={simpleData} selectedId="2" />);
    const selected = screen.getByText('Item 2').closest('[role="treeitem"]');
    expect(selected).toHaveAttribute('aria-selected', 'true');
  });

  it('applies aria-expanded on nodes with children', () => {
    render(<TreeList data={nestedData} />);
    const folder = screen.getByText('Folder 1').closest('[role="treeitem"]');
    expect(folder).toHaveAttribute('aria-expanded', 'false');
  });

  it('auto-expands nodes from defaultExpanded', () => {
    render(<TreeList data={nestedData} defaultExpanded={['1']} />);
    expect(screen.getByText('File 1-1')).toBeInTheDocument();
  });

  it('renders with showLines class', () => {
    render(
      <TreeList data={simpleData} showLines className="test-root" />,
    );
    const tree = screen.getByRole('tree');
    expect(tree).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    const data: TreeNode[] = [
      { id: '1', label: 'Item', icon: <span>★</span> },
    ];
    render(<TreeList data={data} />);
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('supports keyboard navigation: ArrowDown from nothing selected', async () => {
    const user = userEvent.setup();
    render(<TreeList data={simpleData} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    await user.keyboard('{ArrowDown}');
    expect(
      screen.getByText('Item 1').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(
      screen.getByText('Item 2').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation: ArrowUp from nothing selected', async () => {
    const user = userEvent.setup();
    render(<TreeList data={simpleData} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    await user.keyboard('{ArrowUp}');
    expect(
      screen.getByText('Item 3').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard: Home and End', async () => {
    const user = userEvent.setup();
    render(<TreeList data={simpleData} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    await user.keyboard('{End}');
    expect(
      screen.getByText('Item 3').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(
      screen.getByText('Item 1').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard: Enter selects first node when nothing selected, second Enter toggles', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<TreeList data={nestedData} onSelect={onSelect} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(nestedData[0]);
    await user.keyboard('{Enter}');
    expect(screen.getByText('File 1-1')).toBeInTheDocument();
  });

  it('supports ArrowRight to expand, ArrowLeft to collapse', async () => {
    const user = userEvent.setup();
    render(<TreeList data={deepData} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Child')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Grandchild')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
  });

  it('respects controlled selectedId', () => {
    const { rerender } = render(
      <TreeList data={simpleData} selectedId="1" />,
    );
    expect(
      screen.getByText('Item 1').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
    rerender(<TreeList data={simpleData} selectedId="3" />);
    expect(
      screen.getByText('Item 3').closest('[role="treeitem"]'),
    ).toHaveAttribute('aria-selected', 'true');
  });
});
