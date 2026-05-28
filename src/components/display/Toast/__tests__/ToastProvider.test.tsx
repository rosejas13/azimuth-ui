import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider } from '../ToastProvider';
import { useToast } from '../useToast';

function ToastTrigger({
  options,
}: {
  options?: Parameters<ReturnType<typeof useToast>['toast']>[0];
}) {
  const { toast } = useToast();
  return (
    <button onClick={() => toast(options ?? { title: 'Hello' })}>
      Trigger
    </button>
  );
}

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>Child content</div>
      </ToastProvider>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders a toast when toast() is called', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders toast with title and message', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ title: 'Saved', message: 'Changes saved.' }}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Changes saved.')).toBeInTheDocument();
  });

  it('renders toast with variant', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger
          options={{ title: 'Error', variant: 'error' }}
        />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('dismisses toast on close button click', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
    const dismissBtn = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismissBtn);
    await act(() => new Promise((r) => setTimeout(r, 300)));
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after duration', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastTrigger options={{ title: 'Timed', duration: 3000 }} />
      </ToastProvider>,
    );
    act(() => {
      screen.getByText('Trigger').click();
    });
    expect(screen.getByText('Timed')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Timed')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('throws when useToast is used outside provider', () => {
    function BadComponent() {
      useToast();
      return null;
    }
    expect(() => render(<BadComponent />)).toThrow(
      'useToast must be used within ToastProvider',
    );
  });

  it('stacks multiple toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger options={{ title: 'First' }} />
        <ToastTrigger options={{ title: 'Second' }} />
      </ToastProvider>,
    );
    const buttons = screen.getAllByText('Trigger');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('toast returns an id string', async () => {
    const user = userEvent.setup();
    let capturedId = '';
    function CaptureToast() {
      const { toast } = useToast();
      return (
        <button
          onClick={() => {
            capturedId = toast({ title: 'ID test' });
          }}
        >
          Trigger
        </button>
      );
    }
    render(
      <ToastProvider>
        <CaptureToast />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Trigger'));
    expect(capturedId).toMatch(/^toast-/);
  });

  it('dismiss can be called imperatively', async () => {
    const user = userEvent.setup();
    let capturedId = '';
    function CaptureAndDismiss() {
      const { toast, dismiss } = useToast();
      return (
        <>
          <button
            onClick={() => {
              capturedId = toast({ title: 'Dismiss me', duration: 99999 });
            }}
          >
            Show
          </button>
          <button onClick={() => dismiss(capturedId)}>Dismiss</button>
        </>
      );
    }
    render(
      <ToastProvider>
        <CaptureAndDismiss />
      </ToastProvider>,
    );
    await user.click(screen.getByText('Show'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();
    await user.click(screen.getByText('Dismiss'));
    await act(() => new Promise((r) => setTimeout(r, 300)));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });
});
