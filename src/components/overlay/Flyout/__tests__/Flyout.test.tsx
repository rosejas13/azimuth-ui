import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Flyout } from '../Flyout';

describe('Flyout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders trigger content', () => {
    render(
      <Flyout trigger={<button type="button">Hover me</button>} content="Tooltip text" />,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show content initially', () => {
    render(
      <Flyout trigger={<button type="button">Trigger</button>} content="Flyout content" />,
    );
    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
  });

  it('shows content after openDelay on hover', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Flyout content"
        openDelay={200}
      />,
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText('Flyout content')).toBeInTheDocument();
  });

  it('hides content after closeDelay on mouse leave', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Flyout content"
        openDelay={200}
        closeDelay={150}
      />,
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText('Flyout content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Trigger'));
    expect(screen.getByText('Flyout content')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
  });

  it('has role tooltip on content panel', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Flyout content"
      />,
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Content"
        className="my-flyout"
      />,
    );
    const wrapper = screen.getByText('Trigger').closest('[class*="my-flyout"]');
    expect(wrapper).toBeTruthy();
  });

  it('renders with side prop without error', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Content"
        side="left"
      />,
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('cancels open timer if mouse leaves before delay', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Flyout content"
        openDelay={200}
        closeDelay={100}
      />,
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => vi.advanceTimersByTime(100));
    fireEvent.mouseLeave(screen.getByText('Trigger'));
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
  });
});
