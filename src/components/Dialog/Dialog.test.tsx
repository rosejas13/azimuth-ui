import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders when open', () => {
    render(
      <Dialog open onClose={() => {}} title="Delete Item">
        <p>Are you sure?</p>
      </Dialog>,
    );
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Confirm">
        <p>Are you sure?</p>
      </Dialog>,
    );
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    render(
      <Dialog open onClose={() => {}} confirmLabel="Yes" cancelLabel="No" />,
    );
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('uses default button labels', () => {
    render(<Dialog open onClose={() => {}} title="Custom" />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={() => {}} onConfirm={onConfirm} />,
    );
    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={() => {}} onCancel={onCancel} />,
    );
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked and no onCancel', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={onClose} />,
    );
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={onClose} />,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={onClose} />,
    );

    const overlay = document.querySelector('[class*="overlay"]');
    expect(overlay).not.toBeNull();

    const panel = overlay!.querySelector('[class*="panel"]');
    expect(panel).not.toBeNull();

    await user.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when loading', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog open onClose={onClose} loading />,
    );
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders description', () => {
    render(
      <Dialog
        open
        onClose={() => {}}
        title="Delete"
        description="This action cannot be undone."
      />,
    );
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Dialog open onClose={() => {}} title="Custom">
        <p>Custom content</p>
      </Dialog>,
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(
      <Dialog open onClose={() => {}} loading confirmLabel="Save" cancelLabel="Abort" />,
    );
    expect(screen.getByText('Save')).toBeDisabled();
    expect(screen.getByText('Abort')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(
      <Dialog open onClose={() => {}} loading confirmLabel="Delete" />,
    );
    const confirmButton = screen.getByText('Delete').closest('button');
    expect(confirmButton?.querySelector('[class*="spinner"]')).toBeTruthy();
  });

  it('applies info variant to confirm button', () => {
    render(
      <Dialog open onClose={() => {}} variant="info" confirmLabel="Proceed" />,
    );
    expect(screen.getByText('Proceed')).toHaveClass('confirmInfo');
  });

  it('applies warning variant to confirm button', () => {
    render(
      <Dialog open onClose={() => {}} variant="warning" confirmLabel="Proceed" />,
    );
    expect(screen.getByText('Proceed')).toHaveClass('confirmWarning');
  });

  it('applies danger variant to confirm button', () => {
    render(
      <Dialog open onClose={() => {}} variant="danger" confirmLabel="Proceed" />,
    );
    expect(screen.getByText('Proceed')).toHaveClass('confirmDanger');
  });

  it('uses info variant by default', () => {
    render(
      <Dialog open onClose={() => {}} confirmLabel="Proceed" />,
    );
    expect(screen.getByText('Proceed')).toHaveClass('confirmInfo');
  });

  it('uses alertdialog role for warning variant', () => {
    render(
      <Dialog open onClose={() => {}} variant="warning" title="Alert" />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('uses alertdialog role for danger variant', () => {
    render(
      <Dialog open onClose={() => {}} variant="danger" title="Alert" />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('uses dialog role for info variant', () => {
    render(
      <Dialog open onClose={() => {}} variant="info" title="Info" />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies custom className to overlay', () => {
    render(
      <Dialog open onClose={() => {}} className="custom-dialog" />,
    );
    const overlay = document.querySelector('.custom-dialog');
    expect(overlay).toBeInTheDocument();
  });

  it('sets aria-labelledby when title is present', () => {
    render(
      <Dialog open onClose={() => {}} title="My Dialog" />,
    );
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('My Dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
  });

  it('sets aria-describedby when description is present', () => {
    render(
      <Dialog
        open
        onClose={() => {}}
        description="Some description"
      />,
    );
    const dialog = screen.getByRole('dialog');
    const desc = screen.getByText('Some description');
    expect(dialog).toHaveAttribute('aria-describedby', desc.id);
  });

  it('sets aria-modal to true', () => {
    render(
      <Dialog open onClose={() => {}} title="Modal" />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('focuses confirm button on open', async () => {
    render(
      <Dialog open onClose={() => {}} confirmLabel="Delete" cancelLabel="Keep" />,
    );
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByText('Delete'));
    });
  });

  it('displays correct displayName', () => {
    expect(Dialog.displayName).toBe('Dialog');
  });
});
