import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

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
    render(<Tooltip content="Hello world" delay={0}>Hover me</Tooltip>);
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Hello" delay={0}>Hover me</Tooltip>);
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
    render(<Tooltip content="test" className="test-class">Hover me</Tooltip>);
    expect(screen.getByText('Hover me').parentElement).toHaveClass('test-class');
  });

  it('sets aria-describedby on trigger when visible', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Helper" delay={0}>Hover me</Tooltip>);
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      const span = screen.getByText('Hover me');
      expect(span).toHaveAttribute('aria-describedby');
    });
  });

  it('uses custom delay before showing', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Delayed" delay={500}>Hover me</Tooltip>);
    await user.hover(screen.getByText('Hover me'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders multi-line content with newlines', async () => {
    const user = userEvent.setup();
    render(<Tooltip content={"Line 1\nLine 2"} delay={0}>Hover me</Tooltip>);
    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent(/Line 1/);
    expect(tooltip).toHaveTextContent(/Line 2/);
  });
});
