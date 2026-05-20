import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SlideSheet } from './SlideSheet';

describe('SlideSheet', () => {
  it('renders when open', () => {
    render(
      <SlideSheet open onClose={() => {}}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <SlideSheet open={false} onClose={() => {}}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
  });

  it('closes on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet open onClose={onClose}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet open onClose={onClose}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('persistent prop prevents overlay close', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet open onClose={onClose} persistent>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet open onClose={onClose} title="Test Sheet">
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders title', () => {
    render(
      <SlideSheet open onClose={() => {}} title="My Sheet">
        <p>Content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('My Sheet')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <SlideSheet open onClose={() => {}}>
        <p>Child content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SlideSheet open onClose={() => {}} className="my-sheet">
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement!;
    expect(overlay).toHaveClass('my-sheet');
  });

  it('has correct accessibility attributes', () => {
    render(
      <SlideSheet open onClose={() => {}} title="Accessible Sheet">
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const title = screen.getByText('Accessible Sheet');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
  });

  it('renders drag handle for bottom side', () => {
    render(
      <SlideSheet open onClose={() => {}} side="bottom">
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('[class*="handleBar"]')).toBeInTheDocument();
  });

  it('applies height style', () => {
    render(
      <SlideSheet open onClose={() => {}} height="75vh">
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ height: '75vh' });
  });

  it('applies snapPoints style', () => {
    render(
      <SlideSheet open onClose={() => {}} snapPoints={['25vh', '50vh']}>
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ height: '25vh' });
  });
});
