import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ActivityFeed } from '../ActivityFeed';
import type { ActivityEvent } from '../ActivityFeed';

const events: ActivityEvent[] = [
  { id: '1', title: 'Deployed', timestamp: '2m ago', type: 'success' },
  {
    id: '2',
    title: 'Build failed',
    timestamp: '1h ago',
    type: 'danger',
    description: 'Error in integration tests',
  },
  {
    id: '3',
    title: 'PR merged',
    timestamp: '3h ago',
    icon: <span data-testid="custom-icon">🔀</span>,
  },
  {
    id: '4',
    title: 'Comment added',
    timestamp: '5h ago',
    link: { label: 'View', href: '/comment/1' },
  },
  { id: '5', title: 'Deploy started', timestamp: '6h ago', type: 'info' },
  {
    id: '6',
    title: 'Warning',
    timestamp: '7h ago',
    type: 'warning',
    description: 'Disk space low',
  },
  { id: '7', title: 'User joined', timestamp: '1d ago', type: 'default' },
];

describe('ActivityFeed', () => {
  it('renders event title and timestamp', () => {
    render(<ActivityFeed events={[events[0]]} />);
    expect(screen.getByText('Deployed')).toBeInTheDocument();
    expect(screen.getByText('2m ago')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ActivityFeed events={[events[1]]} />);
    expect(screen.getByText('Error in integration tests')).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<ActivityFeed events={[events[2]]} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders link when provided', () => {
    render(<ActivityFeed events={[events[3]]} />);
    const link = screen.getByRole('link', { name: 'View' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/comment/1');
  });

  it('limits visible events with maxVisible', () => {
    render(<ActivityFeed events={events} maxVisible={3} />);
    expect(screen.getByText('Deployed')).toBeInTheDocument();
    expect(screen.getByText('Build failed')).toBeInTheDocument();
    expect(screen.getByText('PR merged')).toBeInTheDocument();
    expect(screen.queryByText('Comment added')).not.toBeInTheDocument();
    expect(screen.queryByText('Deploy started')).not.toBeInTheDocument();
  });

  it('shows "Show more" when events exceed maxVisible', () => {
    render(<ActivityFeed events={events} maxVisible={3} />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('hides "Show more" when all events fit within maxVisible', () => {
    render(<ActivityFeed events={events.slice(0, 3)} maxVisible={3} />);
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  it('shows "Show more" when hasMore is true even if all events fit', () => {
    render(<ActivityFeed events={events.slice(0, 3)} maxVisible={5} hasMore />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('calls onShowMore when "Show more" is clicked', async () => {
    const onShowMore = vi.fn();
    const user = userEvent.setup();
    render(
      <ActivityFeed events={events} maxVisible={3} onShowMore={onShowMore} />,
    );
    await user.click(screen.getByText('Show more'));
    expect(onShowMore).toHaveBeenCalledOnce();
  });

  it('renders empty state when no events', () => {
    render(<ActivityFeed events={[]} />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<ActivityFeed events={[]} emptyMessage="Nothing here yet" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ActivityFeed events={[events[0]]} className="my-feed" />);
    expect(screen.getByRole('feed')).toHaveClass('my-feed');
  });

  it('formats Date timestamps', () => {
    const date = new Date('2024-01-15T10:30:00');
    render(
      <ActivityFeed events={[{ id: '1', title: 'Event', timestamp: date }]} />,
    );
    expect(screen.getByText(date.toLocaleString())).toBeInTheDocument();
  });
});
