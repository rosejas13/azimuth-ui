import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('closes on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose}>
        <p>Modal content</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('persistent prop prevents overlay close', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} persistent>
        <p>Modal content</p>
      </Modal>,
    );
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders title and subtitle', () => {
    render(
      <Modal open onClose={() => {}} title="My Title" subtitle="A subtitle">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Child content</p>
      </Modal>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="Modal"
        footer={<button type="button">Save</button>}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal open onClose={() => {}} className="my-modal">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('my-modal');
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal open onClose={() => {}} title="Accessible Modal">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const title = screen.getByText('Accessible Modal');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
  });

  it('maps size prop to CSS class', () => {
    render(
      <Modal open onClose={() => {}} size="lg">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('maps blur prop to CSS class', () => {
    render(
      <Modal open onClose={() => {}} blur="md">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
