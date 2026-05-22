import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationBadge } from './NotificationBadge';

describe('NotificationBadge', () => {
  it('renders count', () => {
    render(<NotificationBadge count={5}><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders +N when count exceeds max', () => {
    render(<NotificationBadge count={150} max={99}><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('+99')).toBeInTheDocument();
  });

  it('renders dot when dot=true', () => {
    render(<NotificationBadge count={5} dot><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<NotificationBadge count={5}><span>Menu</span></NotificationBadge>);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('does not render badge when count is 0 and dot is false', () => {
    render(<NotificationBadge count={0}><button>Inbox</button></NotificationBadge>);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('renders dot mode when count is 0', () => {
    render(<NotificationBadge count={0}><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });

  it('renders size sm variant', () => {
    render(<NotificationBadge count={5} size="sm"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toHaveClass('sm');
  });

  it('renders size md variant', () => {
    render(<NotificationBadge count={5} size="md"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toHaveClass('md');
  });

  it('renders color accent variant', () => {
    render(<NotificationBadge count={5} color="accent"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toHaveClass('accent');
  });

  it('renders color danger variant', () => {
    render(<NotificationBadge count={5} color="danger"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toHaveClass('danger');
  });

  it('renders color neutral variant', () => {
    render(<NotificationBadge count={5} color="neutral"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('5')).toHaveClass('neutral');
  });

  it('applies custom className', () => {
    render(<NotificationBadge count={5} className="my-badge"><button>Inbox</button></NotificationBadge>);
    expect(screen.getByText('Inbox').parentElement).toHaveClass('my-badge');
  });
});
