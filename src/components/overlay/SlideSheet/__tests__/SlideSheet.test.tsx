import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SlideSheet } from '../SlideSheet';

async function blurThenFocusOverlay(overlay: HTMLElement) {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  overlay.focus();
  await waitFor(() => {
    expect(document.activeElement).toBe(overlay);
  });
}

describe('SlideSheet', () => {
  it('renders when open', () => {
    render(
      <SlideSheet visible={{ open: true, onClose: () => {} }}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <SlideSheet visible={{ open: false, onClose: () => {} }}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
  });

  it('closes on overlay click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet visible={{ open: true, onClose }}>
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
      <SlideSheet visible={{ open: true, onClose }}>
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
      <SlideSheet
        visible={{ open: true, onClose }}
        config={{ persistent: true }}
      >
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close on Space inside an inner textarea', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet visible={{ open: true, onClose }}>
        <input aria-label="Search" defaultValue="hello world" />
        <textarea aria-label="Notes" defaultValue="line one" />
      </SlideSheet>,
    );
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
    });
    await user.click(screen.getByLabelText('Search'));
    await user.keyboard(' ');
    await user.keyboard('{Enter}');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Search')).toHaveValue('hello world ');
    const notes = screen.getByLabelText('Notes');
    await user.click(notes);
    await user.keyboard(' ');
    expect(onClose).not.toHaveBeenCalled();
    expect(notes).toHaveValue('line one ');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Space and Enter while the overlay itself is focused', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet visible={{ open: true, onClose }}>
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const overlay = screen.getByRole('dialog').parentElement!;
    await blurThenFocusOverlay(overlay);
    await user.keyboard(' ');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('closes on X button click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <SlideSheet
        visible={{ open: true, onClose }}
        config={{ title: 'Test Sheet' }}
      >
        <p>Sheet content</p>
      </SlideSheet>,
    );
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders title', () => {
    render(
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ title: 'My Sheet' }}
      >
        <p>Content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('My Sheet')).toBeInTheDocument();
  });

  it('renders children in body section', () => {
    render(
      <SlideSheet visible={{ open: true, onClose: () => {} }}>
        <p>Child content</p>
      </SlideSheet>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    const body = dialog.querySelector('[class*="body"]');
    expect(body).toContainHTML('Child content');
  });

  it('applies side and sheet CSS classes', () => {
    render(
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ side: 'right' }}
      >
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sheet');
    expect(dialog).toHaveClass('right');
  });

  it('has correct accessibility attributes', () => {
    render(
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ title: 'Accessible Sheet' }}
      >
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
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ side: 'bottom' }}
      >
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('[class*="handleBar"]')).toBeInTheDocument();
  });

  it('applies height style', () => {
    render(
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ height: '75vh' }}
      >
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ height: '75vh' });
  });

  it('applies snapPoints style', () => {
    render(
      <SlideSheet
        visible={{ open: true, onClose: () => {} }}
        config={{ snapPoints: ['25vh', '50vh'] }}
      >
        <p>Content</p>
      </SlideSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ height: '25vh' });
  });
});
