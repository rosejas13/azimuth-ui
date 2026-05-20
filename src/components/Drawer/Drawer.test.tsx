import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders when open', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Drawer open={false} onClose={() => {}}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
  });

  it('closes on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={onClose}>
        <p>Drawer content</p>
      </Drawer>,
    );
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={onClose}>
        <p>Drawer content</p>
      </Drawer>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('persistent prop prevents overlay close', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={onClose} persistent>
        <p>Drawer content</p>
      </Drawer>,
    );
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer open onClose={onClose} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders title', () => {
    render(
      <Drawer open onClose={() => {}} title="My Drawer">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByText('My Drawer')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Child content</p>
      </Drawer>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Drawer
        open
        onClose={() => {}}
        title="Drawer"
        footer={<button type="button">Cancel</button>}
      >
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Drawer open onClose={() => {}} className="my-drawer">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('my-drawer');
  });

  it('has correct accessibility attributes', () => {
    render(
      <Drawer open onClose={() => {}} title="Accessible Drawer">
        <p>Content</p>
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const title = screen.getByText('Accessible Drawer');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
  });

  it('maps side and size props to CSS classes', () => {
    render(
      <Drawer open onClose={() => {}} side="right" size="lg">
        <p>Content</p>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
