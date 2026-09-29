import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../Modal';

async function blurThenFocusOverlay(overlay: HTMLElement) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  overlay.focus();
  await waitFor(() => {
    expect(document.activeElement).toBe(overlay);
  });
}

/**
 * Wait out the focus trap's requestAnimationFrame-driven initial focus so
 * it cannot land mid-test and steal focus from whatever the test targets.
 * With focusable content the trap focuses the first field; with none it
 * attempts container focus (a no-op on the tabindex-less overlay).
 */
async function settleAutoFocus(target?: HTMLElement) {
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  if (target) {
    await waitFor(() => {
      expect(document.activeElement).toBe(target);
    });
  }
}

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal visible={{ open: true, onClose: () => {} }}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal visible={{ open: false, onClose: () => {} }}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('closes on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
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
      <Modal visible={{ open: true, onClose }}>
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
      <Modal visible={{ open: true, onClose }} content={{ persistent: true }}>
        <p>Modal content</p>
      </Modal>,
    );
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close on Space inside an inner input', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
        <input aria-label="Search" defaultValue="hello world" />
      </Modal>,
    );
    await settleAutoFocus(screen.getByLabelText('Search'));
    await user.click(screen.getByLabelText('Search'));
    await user.keyboard(' ');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Search')).toHaveValue('hello world ');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Space inside an inner textarea', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
        <textarea aria-label="Notes" defaultValue="hello world" />
      </Modal>,
    );
    await settleAutoFocus(screen.getByLabelText('Notes'));
    await user.click(screen.getByLabelText('Notes'));
    await user.keyboard(' ');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Notes')).toHaveValue('hello world ');
  });

  it('does not close on Enter inside an inner input', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
        <input aria-label="Name" />
      </Modal>,
    );
    await settleAutoFocus(screen.getByLabelText('Name'));
    await user.click(screen.getByLabelText('Name'));
    await user.keyboard('{Enter}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close on Enter inside an inner textarea', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
        <textarea aria-label="Notes" defaultValue="line one" />
      </Modal>,
    );
    await settleAutoFocus(screen.getByLabelText('Notes'));
    await user.click(screen.getByLabelText('Notes'));
    await user.keyboard('{Enter}');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Notes')).toHaveValue('line one\n');
  });

  it('closes on Space and Enter while the overlay itself is focused', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal visible={{ open: true, onClose }}>
        <p>Modal content</p>
      </Modal>,
    );
    await settleAutoFocus();
    const overlay = screen.getByRole('dialog');
    await blurThenFocusOverlay(overlay);
    await user.keyboard(' ');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('persistent prop does not re-enable Space/Enter dismissal from inside content', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(
      <Modal
        visible={{ open: true, onClose }}
        content={{ persistent: true, title: 'Locked' }}
        footer={<button type="button">Save</button>}
      >
        <input aria-label="Name" />
      </Modal>,
    );
    await settleAutoFocus();
    await user.click(screen.getByLabelText('Name'));
    await user.keyboard(' ');
    await user.keyboard('{Enter}');
    expect(onClose).not.toHaveBeenCalled();
    unmount();
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal
        visible={{ open: true, onClose }}
        content={{ title: 'Test Modal' }}
      >
        <p>Modal content</p>
      </Modal>,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders title and subtitle', () => {
    render(
      <Modal
        visible={{ open: true, onClose: () => {} }}
        content={{ title: 'My Title', subtitle: 'A subtitle' }}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Modal visible={{ open: true, onClose: () => {} }}>
        <p>Child content</p>
      </Modal>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Modal
        visible={{ open: true, onClose: () => {} }}
        content={{ title: 'Modal' }}
        footer={<button type="button">Save</button>}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal visible={{ open: true, onClose: () => {} }} className="my-modal">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('my-modal');
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal
        visible={{ open: true, onClose: () => {} }}
        content={{ title: 'Accessible Modal' }}
      >
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
      <Modal
        visible={{ open: true, onClose: () => {} }}
        content={{ size: 'lg' }}
      >
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    const content = dialog.firstElementChild;
    expect(content).toHaveClass('lg');
  });

  it('maps blur prop to CSS class', () => {
    render(
      <Modal
        visible={{ open: true, onClose: () => {} }}
        content={{ blur: 'md' }}
      >
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('overlayBlurMd');
  });
});
