import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip } from '../Tooltip';
import { Button } from '@/components/input/Button';

describe('Tooltip', () => {
  it('renders children', () => {
    render(<Tooltip content="tooltip content">Hover me</Tooltip>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show tooltip by default', () => {
    render(<Tooltip content="Hello">Hover me</Tooltip>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hello world" delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hello" delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    await user.unhover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('applies className to wrapper', () => {
    render(
      <Tooltip content="test" className="test-class">
        Hover me
      </Tooltip>,
    );
    expect(screen.getByText('Hover me').parentElement).toHaveClass(
      'test-class',
    );
  });

  it('wraps plain content in a focusable span trigger without a button role', () => {
    const { container } = render(
      <Tooltip content="Helper" delay={0}>
        Hover me
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');
    expect(trigger.tabIndex).toBe(0);
    expect(trigger).not.toHaveAttribute('role');
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('sets aria-describedby on trigger when visible', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helper" delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      const span = screen.getByText('Hover me');
      expect(span).toHaveAttribute('aria-describedby');
    });
  });

  it('uses custom delay before showing', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delayed" delay={500}>
        Hover me
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders multi-line content with newlines', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content={'Line 1\nLine 2'} delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent(/Line 1/);
    expect(tooltip).toHaveTextContent(/Line 2/);
  });

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content" delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip content" delay={0}>
        Hover me
      </Tooltip>,
    );
    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    act(() => {
      screen.getByText('Hover me').blur();
    });
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders all 4 positions', () => {
    const { unmount: unmountTop } = render(
      <Tooltip content="Top" position="top">
        Top trigger
      </Tooltip>,
    );
    expect(screen.getByText('Top trigger')).toBeInTheDocument();
    unmountTop();

    const { unmount: unmountBottom } = render(
      <Tooltip content="Bottom" position="bottom">
        Bottom trigger
      </Tooltip>,
    );
    expect(screen.getByText('Bottom trigger')).toBeInTheDocument();
    unmountBottom();

    const { unmount: unmountLeft } = render(
      <Tooltip content="Left" position="left">
        Left trigger
      </Tooltip>,
    );
    expect(screen.getByText('Left trigger')).toBeInTheDocument();
    unmountLeft();

    const { unmount: unmountRight } = render(
      <Tooltip content="Right" position="right">
        Right trigger
      </Tooltip>,
    );
    expect(screen.getByText('Right trigger')).toBeInTheDocument();
    unmountRight();
  });

  describe('with an interactive child', () => {
    it('renders the child as the trigger without nesting buttons', () => {
      const { container } = render(
        <Tooltip content="Save changes">
          <Button>Save</Button>
        </Tooltip>,
      );
      expect(container.querySelectorAll('button')).toHaveLength(1);
      expect(container.querySelector('button button')).toBeNull();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('shows the tooltip when the child button is hovered', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Save changes" delay={0}>
          <Button>Save</Button>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      await user.hover(button);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      expect(screen.getByText('Save changes')).toBeInTheDocument();
    });

    it('hides the tooltip when the child button is unhovered', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Save changes" delay={0}>
          <Button>Save</Button>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      await user.hover(button);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      await user.unhover(button);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('shows the tooltip on child focus and hides on blur', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Save changes" delay={0}>
          <Button>Save</Button>
        </Tooltip>,
      );
      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      act(() => {
        screen.getByRole('button', { name: 'Save' }).blur();
      });
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('sets aria-describedby on the child button while visible', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Save changes" delay={0}>
          <Button>Save</Button>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).not.toHaveAttribute('aria-describedby');
      await user.hover(button);
      await waitFor(() => {
        expect(button).toHaveAttribute(
          'aria-describedby',
          screen.getByRole('tooltip').id,
        );
      });
      await user.unhover(button);
      await waitFor(() => {
        expect(button).not.toHaveAttribute('aria-describedby');
      });
    });

    it('merges aria-describedby when the child already has one', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Save changes" delay={0}>
          <Button aria-describedby="existing-id">Save</Button>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      await user.hover(button);
      await waitFor(() => {
        const tooltipId = screen.getByRole('tooltip').id;
        expect(button).toHaveAttribute(
          'aria-describedby',
          `existing-id ${tooltipId}`,
        );
      });
    });
  });
});
