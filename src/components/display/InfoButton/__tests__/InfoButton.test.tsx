import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InfoButton } from '../InfoButton';

describe('InfoButton', () => {
  it('renders info button', () => {
    render(<InfoButton content="Helpful info" />);
    expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();
  });

  it('shows popover on click', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Details here" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('hides popover on second click', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Details here" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Details here')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Details here')).not.toBeInTheDocument();
  });

  it('renders title when provided', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Content" title="Info" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('sets aria-expanded on the button', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Test" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders custom children instead of default icon', () => {
    render(<InfoButton content="Test"><span data-testid="custom-icon">?</span></InfoButton>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders popover as dialog role', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Popup content" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<InfoButton content="test" className="my-class" />);
    expect(screen.getByRole('button').parentElement).toHaveClass('my-class');
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<InfoButton content="Dismiss me" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  describe('showOnHover', () => {
    it('shows popover on mouse enter', async () => {
      const user = userEvent.setup();
      render(<InfoButton content="Hover content" showOnHover />);
      await user.hover(screen.getByRole('button'));
      expect(screen.getByText('Hover content')).toBeInTheDocument();
    });

    it('hides popover on mouse leave after 300ms delay', () => {
      vi.useFakeTimers();
      render(<InfoButton content="Hover content" showOnHover />);
      const btn = screen.getByRole('button');
      act(() => { fireEvent.mouseOver(btn); });
      expect(screen.getByText('Hover content')).toBeInTheDocument();
      act(() => {
        fireEvent.mouseOut(btn);
        vi.advanceTimersByTime(300);
      });
      expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
      vi.useRealTimers();
    });

    it('click still toggles when showOnHover is true', () => {
      render(<InfoButton content="Toggle me" showOnHover />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Toggle me')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByText('Toggle me')).not.toBeInTheDocument();
    });
  });
});
