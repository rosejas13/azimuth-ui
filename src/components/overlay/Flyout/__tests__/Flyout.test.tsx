import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
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
      <Flyout
        trigger={<button type="button">Hover me</button>}
        content="Tooltip text"
      />,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show content initially', () => {
    render(
      <Flyout
        trigger={<button type="button">Trigger</button>}
        content="Flyout content"
      />,
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

    void act(() => vi.advanceTimersByTime(200));
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
    void act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText('Flyout content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Trigger'));
    expect(screen.getByText('Flyout content')).toBeInTheDocument();

    void act(() => vi.advanceTimersByTime(150));
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
    void act(() => vi.advanceTimersByTime(200));
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
    void act(() => vi.advanceTimersByTime(100));
    fireEvent.mouseLeave(screen.getByText('Trigger'));
    void act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
  });

  describe('keyboard interaction', () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it('opens on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Flyout trigger={<span>Trigger</span>} content="Flyout content" />,
      );
      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(screen.getByText('Flyout content')).toBeInTheDocument();
    });

    it('opens on Space key', async () => {
      const user = userEvent.setup();
      render(
        <Flyout trigger={<span>Trigger</span>} content="Flyout content" />,
      );
      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard(' ');
      expect(screen.getByText('Flyout content')).toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Flyout trigger={<span>Trigger</span>} content="Flyout content" />,
      );
      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(screen.getByText('Flyout content')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
    });

    it('manages focus on open - trigger retains focus after opening', async () => {
      const user = userEvent.setup();
      render(
        <Flyout trigger={<span>Trigger</span>} content="Flyout content" />,
      );
      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveFocus();
    });
  });
});
