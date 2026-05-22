import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timeline } from './Timeline';

const items = [
  { id: '1', title: 'Step 1', date: '2025-01-01', description: 'First step' },
  { id: '2', title: 'Step 2', date: '2025-02-01', description: 'Second step' },
  { id: '3', title: 'Step 3' },
];

describe('Timeline', () => {
  it('renders all items', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders dates when provided', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('2025-02-01')).toBeInTheDocument();
  });

  it('does not render date when not provided', () => {
    render(<Timeline items={items} />);
    const titles = screen.getAllByText(/Step/);
    expect(titles).toHaveLength(3);
  });

  it('renders descriptions when provided', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
  });

  it('renders alternating variant', () => {
    render(<Timeline items={items} variant="alternating" />);
    const itemElements = screen.getAllByText(/Step/);
    expect(itemElements).toHaveLength(3);
  });

  it('renders default variant', () => {
    render(<Timeline items={items} variant="default" />);
    const itemElements = screen.getAllByText(/Step/);
    expect(itemElements).toHaveLength(3);
  });

  it('renders icons when provided', () => {
    const itemsWithIcons = [
      { id: '1', title: 'Step 1', icon: <span data-testid="icon-1">*</span> },
      { id: '2', title: 'Step 2', icon: <span data-testid="icon-2">*</span> },
    ];
    render(<Timeline items={itemsWithIcons} />);
    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-2')).toBeInTheDocument();
  });

  it('renders with color prop', () => {
    const itemsWithColor = [
      { id: '1', title: 'Step 1', color: '#ff0000' },
    ];
    render(<Timeline items={itemsWithColor} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Timeline items={items} className="my-timeline" />);
    const timelineItems = screen.getAllByText(/Step/);
    expect(timelineItems).toHaveLength(3);
  });
});
