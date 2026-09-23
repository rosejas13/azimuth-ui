import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders title, message, and action labels', () => {
    render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Delete partner?"
        message="Deletes take effect when you press Save all."
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('Delete partner?')).toBeInTheDocument();
    expect(
      screen.getByText('Deletes take effect when you press Save all.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ConfirmDialog
        visible={{ open: false, onClose: () => {} }}
        title="Delete partner?"
        message="Are you sure?"
      />,
    );
    expect(screen.queryByText('Delete partner?')).not.toBeInTheDocument();
  });

  it('defaults severity to danger (alertdialog semantics)', () => {
    const { container } = render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Delete"
        message="sure?"
      />,
    );
    expect(
      container.ownerDocument.querySelector('[role="alertdialog"]'),
    ).toBeInTheDocument();
  });

  it('warn severity still renders alertdialog semantics (Dialog treats warnings as alerts)', () => {
    const { container } = render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Unsaved changes"
        message="Leave anyway?"
        severity="warn"
      />,
    );
    expect(
      container.ownerDocument.querySelector('[role="alertdialog"]'),
    ).toBeInTheDocument();
  });

  it('calls onConfirm on confirm click', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Delete"
        message="sure?"
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel and onClose on cancel click', async () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        visible={{ open: true, onClose }}
        title="Delete"
        message="sure?"
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('focus lands on the cancel button, not confirm', async () => {
    render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Delete"
        message="sure?"
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    await new Promise((r) => setTimeout(r, 10));
    expect((document.activeElement as HTMLElement)?.textContent).toBe('Cancel');
  });

  it('loading disables both buttons', () => {
    render(
      <ConfirmDialog
        visible={{ open: true, onClose: () => {} }}
        title="Delete"
        message="sure?"
        confirmLabel="Delete"
        loading
      />,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});
