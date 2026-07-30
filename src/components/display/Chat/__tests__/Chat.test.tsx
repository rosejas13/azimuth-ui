import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chat, type ChatMessage } from '../Chat';

const mockMessages: ChatMessage[] = [
  { id: '1', text: 'Hello', sender: 'user' },
  {
    id: '2',
    text: 'Hi there!',
    sender: 'other',
    timestamp: new Date('2024-01-01T10:00:00'),
  },
  {
    id: '3',
    text: 'How are you?',
    sender: 'user',
    timestamp: new Date('2024-01-01T10:01:00'),
  },
];

describe('Chat', () => {
  it('renders messages with correct alignment', () => {
    render(<Chat messages={mockMessages} onSend={vi.fn()} />);
    const bubbles = screen.getAllByText(/Hello|Hi there!|How are you?/);
    expect(bubbles).toHaveLength(3);
  });

  it('shows empty state when no messages', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(
      screen.getByText('No messages yet. Start the conversation!'),
    ).toBeInTheDocument();
  });

  it('calls onSend when send button clicked', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello world');
    await user.click(screen.getByLabelText('Send message'));
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('calls onSend when Enter key pressed', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello world');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Hello world');
  });

  it('clears input after sending', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello');
    await user.click(screen.getByLabelText('Send message'));
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('disables send button when input is empty', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={vi.fn()} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hi');
    expect(screen.getByLabelText('Send message')).toBeEnabled();
  });

  it('does not send empty or whitespace-only messages', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, '   ');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('renders timestamp when provided', () => {
    render(<Chat messages={mockMessages} onSend={vi.fn()} />);
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:01 AM')).toBeInTheDocument();
  });

  it('does not render timestamp when not provided', () => {
    const msgs: ChatMessage[] = [{ id: '1', text: 'Hello', sender: 'user' }];
    render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <Chat messages={[]} onSend={vi.fn()} placeholder="Ask something..." />,
    );
    expect(screen.getByPlaceholderText('Ask something...')).toBeInTheDocument();
  });

  it('renders header with Chat title', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Chat messages={[]} onSend={vi.fn()} className="my-chat" />,
    );
    expect(container.firstChild).toHaveClass('my-chat');
  });

  it('uses a textarea so it can hold multiple lines', () => {
    render(<Chat messages={[]} onSend={vi.fn()} />);
    expect(screen.getByLabelText('Message input').tagName).toBe('TEXTAREA');
  });

  it('inserts a newline on Shift+Enter without sending', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText<HTMLTextAreaElement>('Message input');
    await user.type(input, 'line one{Shift>}{Enter}{/Shift}line two');
    expect(input.value).toBe('line one\nline two');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('sends the full multiline text on Enter', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByLabelText('Message input');
    await user.type(input, 'line one{Shift>}{Enter}{/Shift}line two');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('line one\nline two');
  });

  it('renders markdown formatting as HTML elements', () => {
    const msgs: ChatMessage[] = [
      {
        id: '1',
        sender: 'other',
        format: 'markdown',
        text: 'Some **bold** and `code`\n\n- one\n- two\n\n[link](https://example.com)',
      },
    ];
    const { container } = render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(container.querySelector('strong')).toHaveTextContent('bold');
    expect(container.querySelector('code')).toHaveTextContent('code');
    expect(container.querySelectorAll('li')).toHaveLength(2);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    // No literal markdown syntax leaks through.
    expect(screen.queryByText(/\*\*bold\*\*/)).not.toBeInTheDocument();
  });

  it('renders format:text as a literal string (no markdown)', () => {
    const msgs: ChatMessage[] = [
      { id: '1', sender: 'user', text: 'literal **stars** stay' },
    ];
    const { container } = render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(screen.getByText('literal **stars** stay')).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeNull();
  });

  it('does not execute HTML embedded in markdown (XSS)', () => {
    const msgs: ChatMessage[] = [
      {
        id: '1',
        sender: 'other',
        format: 'markdown',
        text: '<script>window.__pwned = true</script><img src=x onerror="window.__pwned = true">',
      },
    ];
    const { container } = render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    // Raw HTML is shown as literal text instead.
    expect(container.textContent).toContain('<script>');
  });

  it('strips javascript: links, rendering them as plain text (XSS)', () => {
    const msgs: ChatMessage[] = [
      {
        id: '1',
        sender: 'other',
        format: 'markdown',
        text: '[click me](javascript:alert(1))',
      },
    ];
    const { container } = render(<Chat messages={msgs} onSend={vi.fn()} />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('click me');
  });

  it('renders custom bubble content via renderMessage', () => {
    render(
      <Chat
        messages={mockMessages}
        onSend={vi.fn()}
        renderMessage={(msg) => (
          <div data-testid={`custom-${msg.id}`}>custom: {msg.text}</div>
        )}
      />,
    );
    expect(screen.getByTestId('custom-1')).toHaveTextContent('custom: Hello');
    expect(screen.getByTestId('custom-2')).toHaveTextContent(
      'custom: Hi there!',
    );
  });

  it('still renders timestamps alongside custom content', () => {
    render(
      <Chat
        messages={mockMessages}
        onSend={vi.fn()}
        renderMessage={(msg) => <span>{msg.text.toUpperCase()}</span>}
      />,
    );
    expect(screen.getByText('HI THERE!')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  it('falls back to msg.text when renderMessage is omitted', () => {
    render(<Chat messages={mockMessages} onSend={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders a custom title node in place of the default', () => {
    render(
      <Chat
        messages={[]}
        onSend={vi.fn()}
        title={<span data-testid="custom-title">Tutor</span>}
      />,
    );
    expect(screen.getByTestId('custom-title')).toHaveTextContent('Tutor');
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('renders headerActions in the header', () => {
    render(
      <Chat
        messages={[]}
        onSend={vi.fn()}
        headerActions={<button type="button">Settings</button>}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Settings' }),
    ).toBeInTheDocument();
  });

  it('hides the header when hideHeader is set', () => {
    render(<Chat messages={[]} onSend={vi.fn()} hideHeader />);
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  it('renders a custom empty state', () => {
    render(
      <Chat
        messages={[]}
        onSend={vi.fn()}
        emptyState={<div>Say hola to begin</div>}
      />,
    );
    expect(screen.getByText('Say hola to begin')).toBeInTheDocument();
    expect(
      screen.queryByText('No messages yet. Start the conversation!'),
    ).not.toBeInTheDocument();
  });
});
